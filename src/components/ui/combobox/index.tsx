import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import React, { useCallback, useMemo, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { FaListCheck } from 'react-icons/fa6'

interface ComboboxProps<T> {
  data: T[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  id: string
  label: string
  idKey?: keyof T
  textValueKey: keyof T
  filterKey: (keyof T)[]
  itemRenderer: (item: T) => React.ReactNode
  labelChipRenderer?: (item: T) => React.ReactNode
  isRequired?: boolean
  isMultiple?: boolean
}

export function Combobox<T>({
  data,
  value,
  onChange,
  label,
  idKey = 'id' as keyof T,
  textValueKey,
  filterKey,
  itemRenderer: ItemRenderer,
  labelChipRenderer: LabelChipRenderer,
  isRequired = false,
  isMultiple = false,
  id,
}: ComboboxProps<T>) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState('')
  const hasSearchFilter = Boolean(search)
  const filteredData = useMemo(() => {
    if (!data?.length) return []
    let filteredData = [...data]

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        filterKey.some((key) =>
          String(item[key]).toLowerCase().includes(search.toLowerCase()),
        ),
      )
    }

    return filteredData
  }, [data, filterKey, hasSearchFilter, search])
  const [page, setPage] = useState(1)

  const [rowsPerPage, setRowsPerPage] = useState(20)
  const onRowsPerPageChange = useCallback((value: number) => {
    setRowsPerPage(value)
    setPage(1)
  }, [])

  const rowsPagination = useMemo(() => [10, 15, 20, 50, 100], [])

  const pages = Math.ceil(filteredData.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredData.slice(start, end)
  }, [page, filteredData, rowsPerPage])

  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>()

  const Items = () => (
    <Listbox
      items={items ?? []}
      aria-label={String(textValueKey)}
      onAction={
        !isMultiple
          ? (key) => {
              onChange(String(key))
              onClose()
            }
          : undefined
      }
      // disallowEmptySelection
      emptyContent={`Nenhum ${label.toLowerCase()} encontrado`}
      selectionMode={isMultiple ? 'multiple' : 'none'}
      selectedKeys={selectedKeys}
      onSelectionChange={(val) => {
        setSelectedKeys(val as any)
        onChange(Array.from(val as any).map((a) => String(a)))
      }}
    >
      {(item) => (
        <ListboxItem
          key={String(item[idKey])}
          textValue={String(item[textValueKey])}
        >
          {ItemRenderer(item)}
        </ListboxItem>
      )}
    </Listbox>
  )

  const SingleComboBox = () => (
    <Input
      classNames={{
        label: 'cursor-pointer w-full',
        input: 'cursor-pointer',
      }}
      onClick={onOpen}
      variant="bordered"
      color="primary"
      value={
        value
          ? String(
              data.find(
                (a) =>
                  String(a[idKey]).toLowerCase() ===
                  value?.toString().toLowerCase(),
              )?.[textValueKey],
            )
          : ''
      }
      id={id}
      name={id}
      label={<span onClick={onOpen}>{label}</span>}
      isRequired={isRequired}
      isReadOnly
      onInput={() => onOpen()}
      endContent={
        // button isIconOnly with clear icon and function to clear the input
        !value ? null : (
          <Button
            size="sm"
            variant="light"
            radius="full"
            onClick={() => {
              onChange('')
            }}
            isIconOnly
          >
            <FaTimes />
          </Button>
        )
      }
    />
  )
  const MultipleComboBox = () => (
    <>
      <Select
        label={label}
        onSelectionChange={(value) =>
          // nothing to do here
          console.log(value)
        }
        selectedKeys={selectedKeys}
        variant="bordered"
        color="primary"
        classNames={{
          value: 'text-foreground',
          label: 'overflow-visible',
        }}
        items={items}
        selectionMode="multiple"
        isMultiline={Array.from(selectedKeys ?? []).length > 0}
        onOpenChange={() => {
          //do nothing
          onOpen()
        }}
        id={id}
        name={id}
        isRequired={isRequired}
        renderValue={(items) => {
          return (
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedKeys ?? []).map((item: string) => (
                <div key={item}>
                  <Chip
                    isCloseable
                    onClose={() => {
                      setSelectedKeys((prev) => {
                        if (!prev) return new Set()
                        prev.delete(item)
                        return new Set(prev)
                      })
                    }}
                  >
                    {LabelChipRenderer
                      ? LabelChipRenderer(
                          data.find(
                            (a) =>
                              String(a[idKey]).toLowerCase() ===
                              item.toString().toLowerCase(),
                          )!,
                        )
                      : String(
                          data.find(
                            (a) =>
                              String(a[idKey]).toLowerCase() ===
                              item.toString().toLowerCase(),
                          )?.[textValueKey],
                        )}
                  </Chip>
                </div>
              ))}
            </div>
          )
        }}
      >
        {(item) => (
          <SelectItem key={String(item[idKey])} className="capitalize">
            {label}
          </SelectItem>
        )}
      </Select>
    </>
  )

  const selectAllItems = () => {
    setSelectedKeys(new Set(filteredData.map((a) => String(a[idKey]))))
    onChange(filteredData.map((a) => String(a[idKey])))
  }

  return (
    <>
      {!isMultiple ? <SingleComboBox /> : <MultipleComboBox />}
      <Modal
        classNames={{
          wrapper: 'h-[calc(100dvh - 2.5rem)] top-10 rounded-md',
        }}
        size="full"
        isOpen={isOpen}
        onClose={onClose}
        closeButton={<></>}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex items-center gap-4">
                <Input
                  label="Pesquisa"
                  type="text"
                  min={0}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  value={search}
                  variant="bordered"
                  color="primary"
                  autoFocus
                />
                <Tooltip
                  content="Selecionar todos"
                  placement="bottom-end"
                  className="text-white"
                  color="primary"
                >
                  <Button
                    variant="flat"
                    onClick={selectAllItems}
                    className="rounded-full"
                    isIconOnly
                  >
                    <FaListCheck />
                  </Button>
                </Tooltip>
              </ModalHeader>
              <ModalBody className="max-h-[60dvh] flex-none overflow-auto">
                <Items />
              </ModalBody>
              <ModalFooter className="items-center justify-center p-0">
                <div className="flex flex-col gap-4">
                  {isMultiple && (
                    <Button
                      variant="flat"
                      onClick={onClose}
                      className="mt-4 w-full"
                    >
                      Confirmar
                    </Button>
                  )}
                  <Pagination
                    showControls
                    showShadow
                    color="primary"
                    size="sm"
                    initialPage={page}
                    page={page}
                    total={pages === 0 ? 1 : pages}
                    onChange={setPage}
                    variant="light"
                    classNames={{
                      cursor: 'font-bold text-white',
                      base: 'flex justify-center',
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-small dark:text-default-400">
                      Total de {filteredData.length} registros
                    </span>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="light" size="sm">
                          <span className="mr-2 text-small dark:text-default-400">
                            Paginação de
                          </span>
                          {rowsPerPage}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        variant="light"
                        aria-label="Paginação"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={[rowsPerPage]}
                      >
                        {rowsPagination.map((value) => (
                          <DropdownItem
                            key={value}
                            onClick={() => onRowsPerPageChange(value)}
                          >
                            {value}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
