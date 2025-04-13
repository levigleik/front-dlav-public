import axios from 'axios'
import { ColumnProps } from 'components/table/types'

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const parseEmail = (email: string) => email.toLowerCase().trim()

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const columnsFilterable = <T extends Record<string, any>>(
  columns: ColumnProps<T>[],
) => {
  return columns
    .filter((column) => column.filterable)
    .map((column) => ({ uid: column.uid, label: column.label }))
}

export const convertToBase64 = (file: File) => {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader?.result)
    }
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

export const convertUrlToBase64 = async (url: string) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  const base64 = Buffer.from(response.data, 'binary').toString('base64')
  return `data:${response.headers['content-type']};base64,${base64}`
}

export const convertUrlToFile = async (url: string, filename: string) => {
  const base64 = await convertUrlToBase64(url)
  console.log(base64)
  const base64ToFile = (base64: string, filename: string) => {
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)![1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    // eslint-disable-next-line no-plusplus
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }
  if (typeof base64 === 'string') {
    const file = base64ToFile(base64 ?? '', filename)
    return file
  }
  return null
}

export const formatBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})
export function capitalizeFirstLetter(sentence?: string) {
  // Divide a frase em palavras
  if (!sentence) return sentence
  const words = sentence.split(' ')

  // Capitaliza a primeira letra de cada palavra e uncapitaliza o restante
  const modifiedWords = words.map((word) => {
    // Garante que a palavra não está vazia
    if (word.length === 0) {
      return word
    }

    // Capitaliza a primeira letra e uncapitaliza o restante
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  })

  // Junta as palavras de volta para formar a frase
  return modifiedWords.join(' ')
}

export function groupBy<K, V>(
  list: Array<V>,
  keyGetter: (input: V) => K,
): Map<K, Array<V>> {
  const map = new Map<K, Array<V>>()

  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}
