import { useState } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import * as yup from 'yup'

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react'

import { Input } from '../Input'

const setSchedule = async schedule =>
  axios({
    method: 'POST',
    url: '/api/schedule',
    data: {
      ...schedule,
      username: window.location.pathname.replace('/', '')
    }
  })

const ModalTimeBlock = ({ isOpen, onClose, onComplete, children }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Booking</ModalHeader>
      <ModalCloseButton />
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button colorScheme="blue" mr={3} onClick={onComplete}>Book Schedule</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)

export const TimeBlock = ({ time }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((prevState) => !prevState)

  const { touched, errors, values, handleChange, handleBlur, handleSubmit } = useFormik({
    onSubmit: (values) => setSchedule({...values, when: time }),
    initialValues: {
      name: '',
      mobile: ''
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Name is required.'),
      mobile: yup.string().required('Mobile is required.')
    }),
  })

  return (
    <Button p={8} bg="blue.500" color="white" onClick={toggle}>
      {time}
      <ModalTimeBlock
        isOpen={isOpen}
        onClose={toggle}
        onComplete={handleSubmit}
      >
        <>
          <Input
            label="Name:"
            name="name"
            placeholder="Enter your name"
            touched={touched.name}
            error={errors.name}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            mt={4}
            label="Mobile:" 
            name="mobile"
            placeholder="9999 999 999"
            touched={touched.mobile}
            error={errors.mobile} 
            value={values.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </>
      </ModalTimeBlock>
    </Button>
  )
} 