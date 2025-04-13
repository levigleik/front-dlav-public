'use client'
import { Button } from '@nextui-org/react'
import { useRolTinturiaHook } from './hook'

const BottomFunc = () => {
  const { tab, setTab } = useRolTinturiaHook()
  return (
    <div className={`flex ${tab === '1' ? 'justify-end' : 'justify-between'}`}>
      {tab !== '1' && tab !== '2' && (
        <Button
          type="button"
          variant="flat"
          color="primary"
          className="w-fit"
          onClick={() => {
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
