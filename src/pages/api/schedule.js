import { firebaseServer } from '../../config/firebase/server'
import { differenceInHours, format, addHours } from 'date-fns'

const database = firebaseServer.firestore()
const profile = database.collection('profiles')
const agenda = database.collection('agenda')

const startAt = new Date(2021, 1, 1, 8, 0)
const endAt = new Date(2021, 1, 1, 17, 0)
const totalHours = differenceInHours(endAt, startAt)

const timeBlocks = []

for (let blockIndex = 0; blockIndex <= totalHours; blockIndex++) {
  const time = format(addHours(startAt, blockIndex), 'HH:mm')
  timeBlocks.push(time)
}

const getUserId = async (username) => {
  const profileDoc = await profile
    .where('username', '==', username)
    .get()

  if (!profileDoc.docs.length) {
    return false
  }

  const { userId } = profileDoc.docs[0].data()

  return userId
}

const setSchedule = async (req, res) => {
  const userId = await getUserId(req.body.username)
  const docId = `${userId}#${req.body.date}#${req.body.time}`
  
  const doc = await agenda.doc(docId).get()

  if (doc.exists) {
    return res.status(400).json({ message: `Schedule: ${req.body.date}-${req.body.time} is blocked.` })
  }

  const booking = await agenda.doc(docId).set({   
    userId,
    date: req.body.date,
    time: req.body.time,
    name: req.body.name,
    mobile: req.body.mobile
  })

  return res.status(200).json(booking)
}

const getSchedule = async (req, res) => {
  try {
    const userId = await getUserId(req.query.username)

    if (!userId) {
      return res.status(404).json({ message: `Username: ${req.query.username} is not valid.` })
    }

    const snapshot = await agenda
      .where('userId', '==', userId)
      .where('date', '==', req.query.date)
      .get()
    
    const docs = snapshot.docs.map((doc) => doc.data())

    const result = timeBlocks.map((time) => ({
      time,
      isBlocked: !!docs.find(doc => doc.time === time)
    }))

    return res.status(200).json(result)
  } catch (error) {
    console.error("Error: /schedule", error)
    return res.status(401)
  }
}

const methods = {
  POST: setSchedule,
  GET: getSchedule
}

export default async (req, res) => methods[req.method] 
  ? methods[req.method](req, res) 
  : res.status(405)