import { DefaultProps } from '@/types/index'
import { SectorProps } from '@/types/sector'

export type ProductStatusTypes =
  | 'Lançamento'
  | 'Identificação'
  | 'Foto'
  | 'Conferência plaqueta'
  | 'Geração de etiqueta'
  | 'Fixação de etiqueta'
  | 'Estoque de entrada'
  | 'Lavagem'
  | 'Centrifugação'
  | 'Secagem'
  | 'Embalagem'
  | 'Estoque de saída'

export type StatusLancamento =
  | 'Lançamento'
  | 'Identificação'
  | 'Foto'
  | 'Conferência plaqueta'
  | 'Geração de etiqueta'
  | 'Fixação de etiqueta'
  | 'Estoque de entrada'

export type StatusLavagem = 'Lavagem' | 'Centrifugação' | 'Secagem'

export type StatusSaida = 'Embalagem' | 'Estoque de saída'

export interface ProductStatusProps<ProductRol> extends DefaultProps {
  name: ProductStatusTypes
  description?: string
  productRol: ProductRol[]
  sector?: SectorProps<any>
  sectorId: number
}
