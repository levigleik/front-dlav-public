export function formatName(fullName: string): string {
  const names = fullName.split(' ')
  const firstName = names[0]
  const lastName = names[names.length - 1]

  if (firstName.length + lastName.length > 17) {
    return `${firstName} ${lastName.charAt(0)}.`
  }
  return `${firstName} ${lastName}`
}

export const fisrtAndSecondLetterName = (fullName: string): string => {
  const names = fullName.split(' ')
  const firstName = names[0]
  const lastName = names[names.length - 1]

  return `${firstName.charAt(0)}${lastName.charAt(0)}`
}
