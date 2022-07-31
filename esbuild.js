// @ts-check

const path = require('path')
const fs = require('fs')
const esbuild = require('esbuild')

fs.existsSync(path.join(__dirname, 'gen')) &&
  fs.rmSync(path.join(__dirname, 'gen'), { recursive: true, force: true })

require('zotero-plugin/copy-assets')
require('zotero-plugin/version')
require('zotero-plugin/rdf')
const { sassPlugin } = require('esbuild-sass-plugin')
const sass = require('sass')

async function build() {
  await esbuild.build({
    bundle: true,
    format: 'iife',
    target: ['firefox60'],
    entryPoints: ['content/zotero-night.ts'],
    outdir: 'build/content',
    color: true,
    plugins: [sassPlugin({ type: 'css-text' })],
  })

  const nightCss = sass.compile('css/night.scss')
  fs.existsSync(path.join(__dirname, 'build/skin')) ||
    fs.mkdirSync(path.join(__dirname, 'build/skin'), { recursive: true })
  fs.writeFileSync(path.join('build', 'skin', 'night.css'), nightCss.css)
}

build().catch((err) => {
  console.log(err)
  process.exit(1)
})
