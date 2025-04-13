'use client'
import React, { useRef } from 'react'
import TabsFunc from '@/app/(logged)/rol/new/tabs'
import { Button, cn } from '@nextui-org/react'
import { maskCNPJ } from '@/utils/masks'
import { capitalizeFirstLetter, formatBRL } from '@/utils/functions'
import { useReactToPrint } from 'react-to-print'
import { DLAV_COMPANY } from '@/utils/constants'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'
import { useCart } from '@/app/(logged)/rol/cart/hook'

const PrintTab = () => {
  const { cart } = useCart()
  const itemsQuantity =
    (cart?.products ?? [])
      ?.map((a) => ({
        quantity: Number(a.quantity ?? 0),
      }))
      ?.reduce((a, b) => a + b.quantity, 0) ?? 0

  // create a ref for a div in typeScript
  const componentRef = useRef<HTMLDivElement>(null)

  const dateToFormat = cart?.createdAt ? new Date(cart?.createdAt) : new Date()
  const formattedDate = format(dateToFormat, 'dd/MM/yyyy')
  const dayOfWeek = format(dateToFormat, 'EEEE', { locale: ptBR })

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,

    //     pageStyle: () => `
    //     @media print {
    //       body {
    //          color: black;
    //          background-color: white;
    //          width: 58mm;
    //          height: 100%;
    //        }
    //     }
    // `,
  })

  return (
    <div className="flex w-full flex-col gap-4">
      <TabsFunc cart={true} isSearchable={false} />
      <div className="flex w-full flex-col items-center justify-center">
        <div
          ref={componentRef}
          className={cn(
            'mb-6 flex min-h-[500px] w-[360px] flex-col items-center',
            'border-1 border-default-400 bg-yellow-100 p-4 text-center text-sm text-default-300',
          )}
        >
          {DLAV_COMPANY.name}
          <br />
          {maskCNPJ(DLAV_COMPANY.cnpj)}
          <br />
          {DLAV_COMPANY.address.publicArea}
          <br />
          {DLAV_COMPANY.address.neighborhood}
          <br />
          {DLAV_COMPANY.phone}
          <br />
          **************************
          <br />
          {capitalizeFirstLetter(cart?.client?.fantasyName ?? '')}
          <br />
          {cart?.client?.id}
          <br />
          {capitalizeFirstLetter(cart?.client?.corporateName ?? '')}
          <br />
          {maskCNPJ(cart?.client?.cnpj ?? 'Sem CNPJ')}
          <br />
          {cart?.client?.address?.number
            ? capitalizeFirstLetter(
                (cart?.client?.address?.publicArea ?? 'Sem endereço') +
                  ' ' +
                  cart?.client?.address?.number,
              )
            : capitalizeFirstLetter(
                cart?.client?.address?.publicArea ?? 'Sem endereço',
              )}
          <br />
          {capitalizeFirstLetter(
            (cart?.client?.address?.neighborhood ?? 'Sem bairro') +
              ', ' +
              (cart?.client?.address?.city ?? 'Sem cidade'),
          )}
          <br />
          {cart?.client?.phone && `Tel: ${cart?.client?.phone}`}
          <br />
          {cart?.client?.email && `Email: ${cart?.client?.email}`}
          <br />
          **************************
          <br />
          Rol 0000{cart?.id ?? ''}
          <br />
          <dl
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <dt>Entrega</dt>
          </dl>
          {cart?.products?.map((product) => (
            <React.Fragment key={product.id}>
              <dl
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <dt>
                  {product.quantity} {product.name}:
                </dt>
                <dd>
                  {(Number(product.price) ?? 0).toFixed(2).replace('.', ',')}
                </dd>
              </dl>
              {product.additionals?.map((additional) => (
                <dl
                  key={additional?.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <dt>
                    {'>'} {additional?.name}
                  </dt>
                  <dd>
                    {(Number(additional?.price ?? 0) ?? 0)
                      .toFixed(2)
                      .replace('.', ',')}{' '}
                  </dd>
                </dl>
              ))}
            </React.Fragment>
          ))}
          <dl
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <dt>Subtotal({itemsQuantity}):</dt>
            <dd>{formatBRL.format(cart?.total ?? 0)}</dd>
          </dl>
          <span>-------------------------------------</span>
          <dl
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <dt>(=) Total:</dt>
            <dd>{formatBRL.format(cart?.total ?? 0)}</dd>
          </dl>
          {/*<span>-------------------------------------</span>*/}
          {/*<dl*/}
          {/*  style={{*/}
          {/*    display: 'flex',*/}
          {/*    justifyContent: 'space-between',*/}
          {/*    width: '100%',*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <dt>(=) Saldo:</dt>*/}
          {/*  <dd>{formatBRL.format(0)}</dd>*/}
          {/*</dl>*/}
          **************************
          <br />
          <QRCodeSVG
            id="qrcode"
            bgColor="transparent"
            value={`${process.env.NEXT_FRONT_URL}/rol/cart?id=${cart?.id}`}
          />
          {/*<Link*/}
          {/*  className="mt-2 text-blue-400 underline"*/}
          {/*  href={`/rol/cart?id=${cart?.id}`}*/}
          {/*  rel="noopener noreferrer"*/}
          {/*  target="_blank"*/}
          {/*>*/}
          {/*  Abrir QRCode*/}
          {/*</Link>*/}
          <br />
          {/*<dl*/}
          {/*  style={{*/}
          {/*    display: 'flex',*/}
          {/*    width: '100%',*/}
          {/*    justifyContent: 'center',*/}
          {/*  }}*/}
          {/*>*/}
          {/*  Entregue em: {formattedDate}*/}
          {/*  <br />({dayOfWeek})*/}
          {/*</dl>*/}
        </div>
        <Button
          type="button"
          variant="flat"
          color="primary"
          className="w-fit"
          // form="formRol"
          // isDisabled={loading || !subscriberName || isViewOnly}
          onClick={() => {
            if (!componentRef.current) return

            // Create a new window
            const printWindow = window.open('', '_blank')

            // Check if the new window is created successfully
            if (printWindow) {
              // Convert the content of componentRef.current into a string
              let content = componentRef.current.innerHTML

              // Write the modified content into the new window
              printWindow.document.write(content)

              // Include the CSS styles
              printWindow.document.write(`
                <style>
                  @media print {
                    body {
                      color: black;
                      background-color: white;
                      font-size: 12px;
                      margin: 0;
                      text-align: center;
                    }
                  }
                </style>
              `)
              // Print the new window
              printWindow.print()
            }
          }}
        >
          Imprimir
        </Button>
      </div>
    </div>
  )
}

export default PrintTab
