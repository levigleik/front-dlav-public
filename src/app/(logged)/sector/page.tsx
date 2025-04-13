'use client'

import Table from '@/components/table'
import { SectorProps } from '@/types/sector'
import { getData } from '@/utils/functions.api'
import { useQuery } from '@tanstack/react-query'
import { columnsSectors } from './constants'

export default function Sector() {
  const { data, isLoading } = useQuery({
    queryKey: ['sector-get'],
    queryFn: ({ signal }) =>
      getData<SectorProps<any>[]>({ url: '/sector', signal }),
  })

  return <Table data={data} columns={columnsSectors} loading={isLoading} />
}
