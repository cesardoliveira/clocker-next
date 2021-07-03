import { FormControl, FormLabel, FormHelperText, Input as InputBase  } from '@chakra-ui/react'

export const Input = ({ label, touched, error, ... props }) => (
  <FormControl id={props.name} p={4} isRequired>
    <FormLabel>{label}</FormLabel>
    <InputBase {...props} />
    {touched && <FormHelperText textColor="#e74c3c">{error}</FormHelperText>}
  </FormControl>
)