'use client'
import { Button } from '@nextui-org/react'
import { useRolHook } from './hook'

const BottomFunc = () => {
  const {
    tab,
    setTab,
    setClientId,
    setPriceListId,
    isWashControl,
    setIsWashControl,
  } = useRolHook()
  return (
    <div className={`flex ${tab === '1' ? 'justify-end' : 'justify-between'}`}>
      {tab !== '1' && tab !== '5' && (
        <Button
          type="button"
          variant="flat"
          color="primary"
          className="w-fit"
          onClick={() => {
            if (tab === '2') {
              setClientId(undefined)
            }
            if (tab === '3') setPriceListId(undefined)
            if (tab === '6') {
              setClientId(undefined)
              setIsWashControl(false)
              setTab('1')
              return
            }
            setTab(String(Number(tab) - 1))
          }}
        >
          Voltar
        </Button>
      )}
      {/*{tab === '4' && (*/}
      {/*  <Button*/}
      {/*    type="button"*/}
      {/*    variant="flat"*/}
      {/*    color="primary"*/}
      {/*    className="w-fit"*/}
      {/*    onClick={() => {*/}
      {/*      add()*/}
      {/*      toast.success('Item adicionado.')*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    Finalizar*/}
      {/*  </Button>*/}
      {/*)}*/}
    </div>
  )
}

export default BottomFunc
