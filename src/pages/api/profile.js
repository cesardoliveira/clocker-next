import { firebaseServer } from '../../config/firebase/server'

const database = firebaseServer.firestore()
const profile = database.collection('profiles')

export default async (req, res) => {
  const [, token] = req.headers.authorization.split(' ')
  
  if (!token) {
    return res.status(401)
  }

  try {
    const { user_id } = await firebaseServer.auth().verifyIdToken(token);

    profile.doc(req.body.username).set({
      userId: user_id,
      username: req.body.username,
    })

    return res.status(200).json({ success: 'Account created with success.' })
  } catch (error) {
    console.error('Error: /profile', error)
    return res.status(401)
  }
}
