import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useFetch } from '@refetty/react'
import axios from 'axios'
import { addDays, subDays } from 'date-fns'

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Container, Box, IconButton, Button } from '@chakra-ui/react'

import { useAuth, Logo, Header, formatDate } from '../components'

const getAgenda = (when) => axios({
  method: 'GET',
  url: '/api/agenda',
  params: { when }
  // headers: {
  //   Authorization: `Bearer ${token}`
  // }
})

export default function Agenda() {
  const [auth, { logout }] = useAuth()
  const router = useRouter()
  const [when, setWhen] = useState(() => new Date()) 
  const [date, { loading, status, error }, fetch] = useFetch(getAgenda, { lazy: true })
 
  const addOneDay = () => setWhen(prevState => addDays(prevState, 1))
  const subtractOneDay = () => setWhen(prevState => subDays(prevState, 1))
  
  useEffect(() => {
    !auth.user && router.push('/')
  }, [auth.user])

  useEffect(() => {
    fetch(when)
  }, [when])

  return (
    <div>
      <Container>
        <Header>
          <Logo size={150} />
          <Button onClick={logout}>Logout</Button>
        </Header>

        <Box mt={8} display="flex" alignItems="center">
          <IconButton 
            icon={<ChevronLeftIcon/>} 
            bg="transparent"
            onClick={subtractOneDay}
          />
          <Box flex={1} textAlign="center">{formatDate(when, 'PPPP')}</Box>
          <IconButton 
            icon={<ChevronRightIcon/>} 
            bg="transparent"
            onClick={addOneDay}
          />
        </Box> 
      </Container>
    </div>
  )
} 