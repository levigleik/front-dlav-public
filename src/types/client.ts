import { AddressProps } from '@/types/address'
import { DefaultProps } from '@/types/index'
import { OriginContactProps } from './originContact'
import { ClientBranchProps } from './clientBranch'
import { EmployeeProps } from '@/types/employee'

export interface CEPProps {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

export type TypeSystemProps = 'interno' | 'web'
export type PersonTypeProps = 'fisica' | 'juridica'

export interface ClientProps extends DefaultProps {
  fantasyName: string
  address: AddressProps<any>
  addressId: number
  cnpj?: string
  corporateName?: string
  ownerName?: string
  ownerCPF?: string
  email?: string
  phone?: string
  employees?: EmployeeProps<any>[]
  originContact?: OriginContactProps<any>
  originContactId: number
  branch?: ClientBranchProps<any>
  branchId: number
  personType?: PersonTypeProps
  type?: TypeSystemProps
}
