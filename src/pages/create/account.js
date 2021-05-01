import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
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
  InputLeftAddon,
  Button,
} from '@chakra-ui/react'

import { Logo, useAuth } from '../../components'

const validationSchema = yup.object().shape({
  email: yup.string().email('Enter a valid email address.').required('Valid e-mail is required.'),
  password: yup.string().required('Password is required.'),
  username: yup.string().required('Username is required.')
})

export default function Home() {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  
  const [auth, { createAccount }] = useAuth()
  const router = useRouter()

  const { 
    values, 
    errors, 
    touched, 
    handleChange, 
    handleBlur, 
    handleSubmit, 
    isSubmitting 
  } = useFormik({
    onSubmit: createAccount,
    validationSchema,
    initialValues: {
      email: '',
      username: '',
      password: ''
    }
  })

  useEffect(() => {
    auth.user && router.push('/agenda')
  }, [auth.user])

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

        <FormControl id="username" p={4} isRequired>
          <InputGroup>
            <InputLeftAddon children="clocker.work/" />
            <Input
              type="username"
              placeholder="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </InputGroup>
          {touched.username && (
            <FormHelperText textColor="#e74c3c">
              {errors.username}
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
            Create My Account
          </Button>
        </Box>
      </Box>
      <Link href="/">Have an account? Sign in now.</Link>
    </Container>
  )
}
