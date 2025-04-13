export const maskCNPJ = (cnpj: string) =>
  cnpj
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, '$1 $2 $3/$4-$5')
    .substring(0, 18)

export const maskCPF = (cpf: string) =>
  cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14)

export const maskCNES = (cnes: string) =>
  cnes.replace(/\D/g, '').substring(0, 7)

export const maskCEP = (cep: string) =>
  cep
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 9)
