import { DefaultProps, OwnerProps } from '.'
export interface AddressProps<Company> extends DefaultProps {
  id: number
  number?: string
  publicArea: string
  state?: string
  city?: string
  zipCode?: string
  referencePoint?: string
  neighborhood?: string
  complement?: string
  country?: string
  owner?: OwnerProps
  ownerId: number
  company?: Company
  companyId: number
}
