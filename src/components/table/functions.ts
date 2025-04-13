import { format, isValid, parseISO } from 'date-fns'

export function flattenObject(obj: any, parentKey = ''): any {
  let flatObject: any = {}
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const newParentKey = parentKey ? `${parentKey}.${key}` : key
      const childObject = flattenObject(obj[key], newParentKey)
      flatObject = { ...flatObject, ...childObject }
    } else {
      const newKey = parentKey ? `${parentKey}.${key}` : key
      flatObject[newKey] = obj[key]
    }
  }
  return flatObject
}

export const isDate = (dateString: string): boolean => {
  // Tenta converter a string para uma data
  const date = parseISO(dateString)

  // verifica se tem 24 caracteres
  if (dateString.length !== 24) return false

  // Verifica se a data é válida
  return isValid(date)
}

// const dataRemovedAllObjectTypes = data?.map((item) => {
//   // Create a new object that has the same properties as item
//   const newData: any = {}
//   for (const key in item) {
//     if (typeof item[key as keyof typeof item] !== 'object') {
//       newData[key as keyof typeof newData] = item[key]
//     }
//     //  else {
//     //   // parse the object to string
//     //   newData[key as any] = flattenObject(item[key as any])
//     // }
//   }
//   return newData as T
// })

// const parseDates = <T>(array: T[]) =>
//   array.map((item) => {
//     const newItem: any = {}
//     // date is something like 2024-01-27T12:04:34.906Z, it should be formatted to 27/01/2024 09:04:34
//     // using date-fns
//     // check if the value is a date
//     for (const key in item) {
//       // console.log(item[key as any])
//
//       if (typeof item[key as any] === 'string' && isDate(item[key as any])) {
//         newItem[key as keyof typeof newItem] = format(
//           item[key as keyof typeof item] as Date,
//           'dd/MM/yyyy HH:mm:ss',
//         )
//       } else {
//         newItem[key as keyof typeof newItem] = item[key]
//       }
//     }
//     return newItem as T
//   })
