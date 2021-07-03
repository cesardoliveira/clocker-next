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

  const { userId } = profileDoc.docs[0].data()

  return userId
}

const setSchedule = async (req, res) => {
  const userId = await getUserId(req.body.username)
  const doc = await agenda.doc(`${userId}#${req.body.when}`).get()

  if (doc.exists) {
    return res.status(400)
  }

  await agenda.doc(`${userId}#${req.body.when}`).set({   
    userId,
    when: req.body.when,
    name: req.body.name,
    mobile: req.body.mobile
  })

  return res.status(200)
}

const getSchedule = async (req, res) => {
  try {
    console.log(timeBlocks)
    return res.status(200).json(timeBlocks)
  } catch (error) {
    console.error('Error: /schedule', error)
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