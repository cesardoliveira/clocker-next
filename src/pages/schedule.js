import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useFetch } from '@refetty/react'
import axios from 'axios'
import { addDays, subDays } from 'date-fns'

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Container, Box, IconButton, Button, SimpleGrid, Spinner } from '@chakra-ui/react'

import { useAuth, formatDate, Logo, Header, TimeBlock } from '../components'

const getSchedule = async (when) =>
  axios({
    method: 'GET',
    url: '/api/schedule',
    params: { when, username: window.location.pathname }
  })

export default function Schedule() {
  const [auth, { logout }] = useAuth()
  const router = useRouter()
  const [when, setWhen] = useState(() => new Date()) 
  const [data, { loading, status, error }, fetch] = useFetch(getSchedule, { lazy: true })
 
  const addOneDay = () => setWhen(prevState => addDays(prevState, 1))
  const subtractOneDay = () => setWhen(prevState => subDays(prevState, 1))
 
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

        <SimpleGrid p={4} columns={2} spacing={4}>
          {loading && (
            <Spinner
              tickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          )}
          {data?.map(time => <TimeBlock key={time} time={time} date={when}/>)}
        </SimpleGrid>
      </Container>
    </div>
  );
} 