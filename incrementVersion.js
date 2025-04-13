const fs = require('fs')
const path = require('path')

function incrementVersion(version) {
  const parts = version.split('.')
  parts[2] = parseInt(parts[2], 10) + 1
  return parts.join('.')
}

function updateEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const versionLineIndex = lines.findIndex((line) =>
    line.startsWith('NEXT_VERSION='),
  )
  if (versionLineIndex !== -1) {
    const version = lines[versionLineIndex].split('=')[1]
    const newVersion = incrementVersion(version)
    lines[versionLineIndex] = `NEXT_VERSION=${newVersion}`
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8')
  }
}

const envFiles = ['.env.development', '.env.production']
envFiles.forEach((file) => updateEnvFile(path.join(__dirname, file)))
