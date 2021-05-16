import { format } from 'date-fns'
import { enAU } from 'date-fns/locale'

export const formatDate = (date, pattern) => format(date, pattern, { locale: enAU })