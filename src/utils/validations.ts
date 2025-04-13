/* eslint-disable radix */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
export const cpfValidate = (cpf: string) => {
  if (!cpf) return false
  cpf = cpf.replace(/[^\d]+/g, '')
  let Soma
  let Resto
  Soma = 0
  if (cpf === '00000000000') return false

  for (let i = 1; i <= 9; i += 1)
    Soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i)
  Resto = (Soma * 10) % 11

  if (Resto === 10 || Resto === 11) Resto = 0
  if (Resto !== parseInt(cpf.substring(9, 10), 10)) return false

  Soma = 0
  for (let i = 1; i <= 10; i += 1)
    Soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i)
  Resto = (Soma * 10) % 11

  if (Resto === 10 || Resto === 11) Resto = 0
  if (Resto !== parseInt(cpf.substring(10, 11), 10)) return false
  return true
}

export const cnpjValidate = (cnpj: string) => {
  cnpj = cnpj.replace(/[^\d]+/g, '')

  if (!cnpj || cnpj.length !== 14) return false

  const invalidNumbers = new Set([
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999',
  ])

  if (invalidNumbers.has(cnpj)) return false

  const calculateDigit = (size: number) => {
    let numbers = cnpj.substring(0, size)
    let sum = 0
    let pos = size - 7
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i), 10) * pos--
      if (pos < 2) pos = 9
    }
    return sum % 11 < 2 ? 0 : 11 - (sum % 11)
  }

  const digits = cnpj.substring(cnpj.length - 2)
  if (calculateDigit(cnpj.length - 2) !== parseInt(digits.charAt(0)))
    return false
  if (calculateDigit(cnpj.length - 1) !== parseInt(digits.charAt(1)))
    return false

  return true
}

export const onlyNumbers = (val: string) => val.replace(/[^\d]+/g, '')
