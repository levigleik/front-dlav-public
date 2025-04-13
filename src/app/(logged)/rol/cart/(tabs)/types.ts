export type SubdivisionFormProps = {
  productRolIds: string[]
  productStatusId: string
  name: string
  id?: string
}
export type ProductRolGroupFormProps = {
  fields: SubdivisionFormProps[]
}

export type ProductRolGroupFormSendProps = {
  productRolIds: number[]
  productStatusId: number
  name: string
  rolId: number
}
