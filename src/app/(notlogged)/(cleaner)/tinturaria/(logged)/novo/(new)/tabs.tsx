'use client'
import { cn, Input, Tab, Tabs } from '@nextui-org/react'
import { FaSearch } from 'react-icons/fa'
import { useRolTinturiaHook } from './hook'

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
  const { setSearch, tab, setTab } = useRolTinturiaHook()

  const placeholder = 'Procure pelo nome'

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
            {/*<Tab*/}
            {/*  key={1}*/}
            {/*  isDisabled*/}
            {/*  className="data-[disabled=true]:cursor-auto data-[disabled=true]:opacity-100"*/}
            {/*  title="Grupo"*/}
            {/*/>*/}
            <Tab
              key={1}
              isDisabled
              className="data-[disabled=true]:cursor-auto data-[disabled=true]:opacity-100"
              title="Produto"
            />
            <Tab
              key={2}
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
              title={'Carrinho'}
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
          startContent={<FaSearch className="mr-2 hidden md:flex" size={20} />}
        />
      )}
    </div>
  )
}

export default TabsFunc
