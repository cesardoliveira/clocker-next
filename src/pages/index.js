import Link from 'next/link'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { 
  Container, 
  Box, 
  Text, 
  FormControl, 
  FormLabel, 
  FormHelperText, 
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from '@chakra-ui/react'

import { Logo } from '../components'
import firebase, { persistenceMode } from '../config/firebase'

const validationSchema = yup.object().shape({
  email: yup.string().email('Enter a valid email address.').required('Valid e-mail is required.'),
  password: yup.string().required('Password is required.')
})

export default function Home() {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  const { 
    values, 
    errors, 
    touched, 
    handleChange, 
    handleBlur, 
    handleSubmit, 
    isSubmitting 
  } = useFormik({
    onSubmit: async (values, form) => {
      firebase.auth().setPersistence(persistenceMode)
      
      try {
        const user = await firebase.auth().signInWithEmailAndPassword(values.email, values.password)
        console.log(user)  
      } catch (error) {
        console.log('ERROR: ', error) 
      }
    },
    validationSchema,
    initialValues: {
      email: '',
      password: ''
    }
  })

  return (
    <Container p={20} centerContent>
      <Logo />
      <Box p={4} mt={8}>
        <Text>Create your shared agenda</Text>
      </Box>
      <Box>
        <FormControl id="email" p={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && (
            <FormHelperText textColor="#e74c3c">{errors.email}</FormHelperText>
          )}
        </FormControl>

        <FormControl id="password" p={4} isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          {touched.password && (
            <FormHelperText textColor="#e74c3c">
              {errors.password}
            </FormHelperText>
          )}
        </FormControl>

        <Box p={4}>
          <Button
            width="100%"
            colorScheme="blue"
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Sign In
          </Button>
        </Box>
      </Box>
      <Link href="/create/account">New to Clocker? Create an account to get started.</Link>
    </Container>
  )
}
