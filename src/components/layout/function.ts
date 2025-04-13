//export table to excel
import * as XLSX from 'xlsx'
import { format } from 'date-fns'

export const exportTableToExcel = <TData>(
  data?: TData[],
  filename = '',
): void => {
  if (!data) return
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  const dateNow = new Date()
  const date = format(dateNow, 'dd-MM-yyyy')
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(
    workbook,
    filename ? `${filename}-${date}.xlsx` : 'excel_data.xlsx',
  )
}
