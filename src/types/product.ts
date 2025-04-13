import { DefectProps } from '@/types/defect'
import { DefaultProps } from '@/types/index'

export interface ProductProps<Group> extends DefaultProps {
  name: string
  type: 'tapete' | 'outro'
  description: string
  identification?: string
  observation: string
  price: number
  round: boolean
  height?: number
  width?: number
  diameter?: number
  photos?: string[]
  additionals?: AdditionalProps[]
  defects?: DefectProps<any>[]
  hairHeights?: HairHeightProps[]
  backgrounds?: BackgroundProps[]
  edges?: EdgeProps[]
  stamps?: StampProps[]
  colors?: ColorProps[]
  group?: Group
  groupId: number
}

export interface AdditionalProps extends DefaultProps {
  name: string
  price: number
  productId: number
}

export interface HairHeightProps extends DefaultProps {
  name: string
  type: string
}

export interface BackgroundProps extends DefaultProps {
  name: string
  type: string
}

export interface EdgeProps extends DefaultProps {
  name: string
  type: string
}

export interface StampProps extends DefaultProps {
  name: string
  type: string
}

export interface ColorProps extends DefaultProps {
  name: string
}
