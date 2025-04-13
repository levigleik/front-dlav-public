import { RolProps } from '@/types/rol'

export const sortArray = (array: RolProps[], property: string) => {
  const tempArray = [...array]
  return tempArray?.sort((a, b) => {
    let propA: any
    let propB: any

    if (property in a && property in b) {
      propA = a[property as keyof typeof a]
      propB = b[property as keyof typeof b]
    }

    if (property === 'client') {
      propA = a?.client?.fantasyName
      propB = b?.client?.fantasyName
    }

    if (propA < propB) {
      return -1
    }
    if (propA > propB) {
      return 1
    }
    return 0
  })
}
