import { useState } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import { format } from 'date-fns'
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

const setSchedule = async ({ date, ...payload }) =>
  axios({
    method: 'POST',
    url: '/api/schedule',
    data: {
      ...payload,
      date: format(date, 'yyyy-MM-dd'),
      username: window.location.pathname.replace('/', '')
    }
  })

const ModalTimeBlock = ({ isOpen, onClose, onComplete, isSubmitting, children }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Booking</ModalHeader>
      <ModalCloseButton />
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        {!isSubmitting && (
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button
          mr={3}
          colorScheme="blue"
          onClick={onComplete}
          isLoading={isSubmitting} 
        >
          Book Schedule
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)

export const TimeBlock = ({ time, date }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((prevState) => !prevState)

  const { touched, errors, values, handleChange, handleBlur, handleSubmit, isSubmitting  } = useFormik({
    onSubmit: async (values) => { 
      try {
        await setSchedule({...values, time, date })
        toggle()
      } catch (error) {
        console.log(error)
      }
    },
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
        isSubmitting={isSubmitting}
      >
        <>
          <Input
            label="Name:"
            name="name"
            placeholder="Enter your name"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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