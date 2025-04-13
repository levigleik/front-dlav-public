import { CEPProps } from '@/types/client'
import axios from 'axios'

export const getCEP = async (cep: string): Promise<CEPProps> => {
  const { data } = await axios.get<CEPProps>(
    `https://viacep.com.br/ws/${cep}/json/`,
  )
  return data
}
