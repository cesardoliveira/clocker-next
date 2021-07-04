import { firebaseServer } from '../../config/firebase/server'

const database = firebaseServer.firestore()
const agenda = database.collection('agenda')

export default async (req, res) => {
  const [, token] = req.headers.authorization.split(' ')

  if (!token) {
    return res.status(401)
  }

  try {
    const { user_id } = await firebaseServer.auth().verifyIdToken(token)

    const snapshot = await agenda
      .where('userId', '==', user_id)
      .where('date', '==', req.query.date)
      .get()
    
    const docs = snapshot.docs.map((doc) => doc.data())

    console.log(docs)
    return res.status(200).json(docs)
  } catch (error) {
    console.error('Error: /agenda', error)
    return res.status(401) 
  }  
}