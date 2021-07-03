import { Button } from '@chakra-ui/react'

export const TimeBlock = ({ time }) => {
  return (
    <Button p={8} bg="blue.500" color="white">
      {time}
    </Button>
  )
}