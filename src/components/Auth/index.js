import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'

import { firebaseClient, persistenceMode } from '../../config/firebase/client'

const AuthContext = React.createContext([{}, () => {}])

export const createAccount = async ({ email, password, username }) => {
  try {
    await firebaseClient.auth().createUserWithEmailAndPassword(email, password)
    const user = await login({ email, password })
    const token = await user.getIdToken()

    const { data } = await axios ({ 
      method: 'post',
      url: '/api/profile',
      data: { username },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

  } catch (error) {
      console.log('createAccount: error', error) 
  }
}

export const login = async ({ email, password }) => {
  firebaseClient.auth().setPersistence(persistenceMode)
  
  try {
    await firebaseClient.auth().signInWithEmailAndPassword(email, password)

    return firebaseClient.auth().currentUser
  } catch (error) {
      console.log('login: error', error) 
  }
}

export const logout = () => firebaseClient.auth().signOut()

export const useAuth = () => {
  const [auth] = useContext(AuthContext)
  return [auth, { createAccount, login, logout }]
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: false,
    user: false
  })

  useEffect(() => {
    const unsubscribe = firebaseClient.auth().onAuthStateChanged(user => {
      setAuth({
        loading: false,
        user
      })
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  )
}