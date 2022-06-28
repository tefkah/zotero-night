const path = require('path')
const fs = require('fs')
const esbuild = require('esbuild')

fs.existsSync(path.join(__dirname, 'gen')) &&
  fs.rmSync(path.join(__dirname, 'gen'), { recursive: true, force: true })

require('zotero-plugin/copy-assets')
require('zotero-plugin/version')
require('zotero-plugin/rdf')
const { sassPlugin } = require('esbuild-sass-plugin')

async function build() {
  await esbuild.build({
    bundle: true,
    format: 'iife',
    target: ['firefox60'],
    entryPoints: ['content/zotero-night.ts'],
    outdir: 'build/content',
    color: true,
    plugins: [sassPlugin({ syntax: 'scss' })],
  })
}

build().catch((err) => {
  console.log(err)
  process.exit(1)
})
