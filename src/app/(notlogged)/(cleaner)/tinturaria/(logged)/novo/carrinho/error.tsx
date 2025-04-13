'use client'
export default function Error() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-300">
        Erro ao buscar rol (QRCODE)
      </h1>
      <h3 className="mt-4 text-2xl font-bold text-gray-500">
        Rol com ID inválido
      </h3>
    </div>
  )
}
