export interface OwnerProps {
  id: number
  userId: number
}

export interface DefaultProps {
  id: number
  ownerId: number
  createdAt: string
  updateAt: string
}

export interface GetData {
  url: string
  query?: string
  id?: number
  signal?: AbortSignal
}

export interface PostData<TForm> {
  url: string
  data: TForm
  signal?: AbortSignal
}
export interface PutData<TForm> {
  url?: string
  data: TForm
  id: number
  signal?: AbortSignal
  fullUrl?: string
}
export interface DeleteData {
  id: number
  url: string
  signal?: AbortSignal
}
export interface TableSearchProps {
  search: string
  setSearch: (search: string) => void
  data?: any[]
  setData: (data: any[]) => void
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined
      ? RecursivePartial<T[P]>
      : T[P]
}

// export type Where<T> = {
//   [P in keyof T]?: T[P] extends (infer U)[]
//     ? Where<U> | WhereArray<U>
//     : T[P] extends object
//     ? Where<T[P]>
//     : T[P]
// }
// export type Include<T> = {
//   [P in keyof T]?: boolean | Include<T[P]>
// }
// export type WhereArray<T> = {
//   some?: Where<T>
//   every?: Where<T>
//   none?: Where<T>
// }
//
// export type QueryParams<T> = {
//   where?: Where<Partial<T>>
//   include?: Include<T>
// }
