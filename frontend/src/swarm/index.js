import path from 'path'
import { BzzFS } from '@erebos/bzz-fs'
import { BzzNode } from '@erebos/bzz-node'

const bzz = new BzzNode({ url: 'http://localhost:8500' })
const bzzFS = new BzzFS({ basePath: __dirname, bzz })

bzzFS
  .uploadDirectoryFrom('my-files')
  .then(hash => bzz.list(hash))
  .then(contents => {
    console.log(contents) // Manifest contents describing the uploaded files
  })