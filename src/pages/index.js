import { useEffect, useState } from 'react'
import { Container, Spinner } from '@chakra-ui/react'

import { Login, Agenda } from '../components'
import firebase from '../config/firebase'

export default function Home() {
  const [auth, setAuth] = useState({
    loading: true,
    user: false
  })

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setAuth({
        loading: false,
        user
      })
    })
  }, [])

  if (auth.loading) {
    return (
      <Container p="20" centerContent>
        <Spinner />
      </Container>
    )
  }

  return auth.user ? <Agenda /> : <Login />
}