import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useFetch } from '@refetty/react'
import { addDays, format, subDays } from 'date-fns'
import axios from 'axios'

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Container, Box, IconButton, Button, Spinner, Heading, Text } from '@chakra-ui/react'

import { getToken } from '../config/firebase/client'
import { useAuth, Logo, Header, formatDate } from '../components'

const getAgenda = async (when) => {
  const token = await getToken()

  return axios({
    method: 'GET',
    url: '/api/agenda',
    params: { date: format(when, 'yyyy-MM-dd') },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const AgendaBlock = ({ time, name, mobile, ...props }) => (
  <Box display="flex" bg="gray.100" borderRadius={8} p={4} alignItems="center" {...props}>
    <Box flex={1}>
      {time}
    </Box>
    <Box>
      <Heading size="md">{name}</Heading>
      <Heading size="sm"> {mobile}</Heading>
    </Box>
  </Box>
)

export default function Agenda() {
  const [auth, { logout }] = useAuth()
  const router = useRouter()
  const [when, setWhen] = useState(() => new Date()) 
  const [data, { loading }, fetch] = useFetch(getAgenda, { lazy: true })
 
  const addOneDay = () => setWhen(prevState => addDays(prevState, 1))
  const subtractOneDay = () => setWhen(prevState => subDays(prevState, 1))
  
  useEffect(() => {
    !auth.user && router.push('/')
  }, [auth.user])

  useEffect(() => {
    fetch(when)
  }, [when])

  console.log('data: ' + data)

  return (
    <Container>
      <Header>
        <Logo size={200} />
        <Button onClick={logout}>Logout</Button>
      </Header>

      <Box mt={8} display="flex" alignItems="center">
        <IconButton
          icon={<ChevronLeftIcon />}
          bg="transparent"
          onClick={subtractOneDay}
        />
        <Box flex={1} textAlign="center">
          {formatDate(when, "PPPP")}
        </Box>
        <IconButton
          icon={<ChevronRightIcon />}
          bg="transparent"
          onClick={addOneDay}
        />
      </Box>

      {loading && (
        <Spinner
          tickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      )}

      {!Array.isArray(data) && <Text fontSize="md">No bookings available</Text>}

      {data?.map((doc) => (
        <AgendaBlock
          mt={4}
          key={doc.time}
          time={doc.time}
          name={doc.name}
          mobile={doc.mobile}
        />
      ))}
    </Container>
  )
} 