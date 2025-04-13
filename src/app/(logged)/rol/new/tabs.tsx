'use client'
import { cn, Input, Tab, Tabs } from '@nextui-org/react'
import { FaSearch } from 'react-icons/fa'
import { useRolHook } from './hook'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/app/(logged)/rol/cart/hook'

type TabsFuncProps = {
  isSearchable?: boolean
  cart?: boolean
  onChange?: () => void
}

const TabsFunc: React.FC<TabsFuncProps> = ({
  isSearchable = true,
  cart = false,
  onChange = () => {},
}) => {
  const { setSearch, tab, setTab, isWashControl, search } = useRolHook()

  const { cart: cartRol } = useCart()

  const placeholder =
    tab === '1'
      ? 'Procure pelo nome, endereço, telefone ou CNPJ'
      : 'Procure pelo nome'

  const hasId = useSearchParams().has('id')

  const titleName = hasId ? 'Produtos' : 'Carrinho'

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="item-center flex w-full justify-center">
        {!cart && (
          <Tabs
            aria-label="Tabs Rols"
            radius="full"
            selectedKey={tab}
            variant="underlined"
            classNames={{
              tabList: 'sm:flex-nowrap flex-wrap',
            }}
            onSelectionChange={(key) => setTab(key)}
          >
            <Tab
              key={1}
              isDisabled
              className="data-[disabled=true]:cursor-auto data-[disabled=true]:opacity-100"
              title="Cliente"
            />
            <Tab
              key={6}
              isDisabled
              className={
                'data-[disabled=true]:cursor-auto data-[disabled=true]:opacity-100' +
                (!isWashControl ? ' hidden' : '')
              }
              title="Empregado"
            />
            <Tab
              key={7}
              isDisabled
              className={
                'data-[disabled=true]:cursor-auto data-[disabled=true]:opacity-100' +
                (!isWashControl ? ' hidden' : '')
              }
              title="Produto"
            />
            <Tab
              key={2}
              isDisabled
              className={
                'data-[disabled=true]:cursor-auto data-[disabled=true]:opacity-100' +
                (isWashControl ? ' hidden' : '')
              }
              title="Tabela"
            />
            <Tab
              key={3}
              isDisabled
              className={
                'data-[disabled=true]:cursor-auto data-[disabled=true]:opacity-100' +
                (isWashControl ? ' hidden' : '')
              }
              title="Grupo"
            />
            <Tab
              key={4}
              isDisabled
              className={
                'data-[disabled=true]:cursor-auto data-[disabled=true]:opacity-100' +
                (isWashControl ? ' hidden' : '')
              }
              title="Produto"
            />
            <Tab
              key={5}
              isDisabled
              className="data-[disabled=true]:cursor-auto data-[disabled=true]:opacity-100"
              title="Características"
            />
          </Tabs>
        )}
        {cart && (
          <Tabs
            aria-label="Tabs carrinho"
            radius="full"
            selectedKey={tab}
            variant="underlined"
            classNames={{
              tabList: 'sm:flex-nowrap flex-wrap',
            }}
            onSelectionChange={(key) => setTab(key)}
          >
            <Tab
              key={1}
              className={cn(
                'data-[disabled=true]:cursor-auto data-[disabled=true]:opacity-100',
              )}
              title={titleName}
            />
            <Tab
              key={2}
              className={cn(
                `data-[disabled=true]:cursor-auto data-[disabled=true]:opacity-100`,
                hasId && 'hidden',
              )}
              title="Assinatura"
            />
            <Tab
              key={3}
              className={cn(
                `data-[disabled=true]:cursor-auto data-[disabled=true]:opacity-100`,
                !cartRol?.id && 'hidden',
                hasId && 'hidden',
              )}
              title="Impressão"
            />
            <Tab
              key={4}
              className={cn(
                `data-[disabled=true]:cursor-auto data-[disabled=true]:opacity-100`,
                !cartRol?.id && 'hidden',
              )}
              title="Loteamento"
            />
          </Tabs>
        )}
      </div>
      {isSearchable && (
        <Input
          className="w-full"
          size="sm"
          classNames={{
            inputWrapper: 'rounded-full h-10',
            input: 'px-4',
          }}
          placeholder={placeholder}
          title={placeholder}
          aria-label={placeholder}
          onChange={(e) => {
            setSearch(e.target.value)
            onChange()
          }}
          value={search}
          startContent={<FaSearch className="mr-2 hidden md:flex" size={20} />}
        />
      )}
    </div>
  )
}

export default TabsFunc
