import api from '@/services/api'
import { DeleteData, GetData, PostData, PutData } from '@/types'
import { toast } from 'react-toastify'
import { delay } from './functions'

export const getData = async <TReturn>(val: GetData) => {
  const { url, query, id } = val
  const params = query ? `?${query}` : ''
  const idParam = id ? `/${id}` : ''
  // const randomSeconds = Math.random() * 2 + 1 // Generate a random number between 1 and 3
  // const milliseconds = randomSeconds * 1000
  // await delay(milliseconds)
  const { data } = await api.get<TReturn>(`${url}${idParam}${params}`)
  return data
}

export const postData = async <TReturn, TForm>(val: PostData<TForm>) => {
  const { url, data: dataForm } = val
  // await delay(Math.random() * 2000)
  const { data } = await api.post<TReturn>(url, dataForm)
  return data
}

export const putData = async <TReturn, TForm>(val: PutData<TForm>) => {
  const { url, data: dataForm, id } = val
  // await delay(Math.random() * 2000)
  const { data } = await api.put<TReturn>(
    val.fullUrl ?? `${url}/${id}`,
    dataForm,
  )
  return data
}

export const deleteData = async <TReturn>(val: DeleteData) => {
  const { url, id } = val
  // await delay(Math.random() * 2000)
  const { data } = await api.delete<TReturn>(`${url}/${id}`)
  return data
}

export const toastErrorsApi = (error: any) => {
  if (error && error.response) {
    if (Array.isArray(error.response?.data.message)) {
      error.response?.data.message.forEach((err: string) => toast.error(err))
    } else toast.error(error.response?.data.message)
  } else toast.error('Erro ao realizar a operação.')
}
