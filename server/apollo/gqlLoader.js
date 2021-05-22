import fs from 'fs'
import path from 'path'

const loadGQLFile = type => {
  const filePath = path.join(__dirname, type)
  return fs.readFileSync(filePath, 'utf-8')
}

module.exports = loadGQLFile
