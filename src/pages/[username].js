import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useFetch } from '@refetty/react'
import { addDays, format, subDays } from 'date-fns'
import axios from 'axios'

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Container, Box, IconButton, SimpleGrid, Spinner } from '@chakra-ui/react'

import { formatDate, Logo, Header, TimeBlock } from '../components'

const getSchedule = async ({ when, username }) =>
  axios({
    method: 'GET',
    url: '/api/schedule',
    params: { 
      date: format(when, 'yyyy-MM-dd'),
      username
    }
  })

export default function Schedule() {
  const router = useRouter()
  const [when, setWhen] = useState(() => new Date()) 
  const [data, { loading }, fetch] = useFetch(getSchedule, { lazy: true })
 
  const addOneDay = () => setWhen(prevState => addDays(prevState, 1))
  const subtractOneDay = () => setWhen(prevState => subDays(prevState, 1))

  const refresh = () => fetch({ when, username: router.query.username })

  useEffect(() => {
    refresh()
  }, [when, router.query.username])

  return (
    <Container>
      <Header>
        <Logo size={200} />
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
        {data?.map(({ time, isBlocked }) => (
          <TimeBlock
            key={time}
            time={time}
            date={when}
            isBlocked={isBlocked}
            onSuccess={refresh}
          />
        ))}
      </SimpleGrid>
    </Container>
  )
} 