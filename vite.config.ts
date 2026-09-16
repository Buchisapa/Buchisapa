import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { transform } from 'lightningcss'
import fs from 'fs'
import path from 'path'

function unwrapCssLayers(code: string): string {
  let result = ''
  let i = 0
  while (i < code.length) {
    if (code.startsWith('/*', i)) {
      const end = code.indexOf('*/', i + 2)
      if (end === -1) {
        result += code.slice(i)
        break
      }
      result += code.slice(i, end + 2)
      i = end + 2
      continue
    }

    if (code.startsWith('@layer', i)) {
      const semicolon = code.indexOf(';', i)
      const brace = code.indexOf('{', i)
      if (semicolon !== -1 && (brace === -1 || semicolon < brace)) {
        i = semicolon + 1
        continue
      }
      if (brace === -1) {
        break
      }

      let depth = 1
      let pos = brace + 1
      while (pos < code.length && depth > 0) {
        if (code[pos] === '{') depth++
        else if (code[pos] === '}') depth--
        pos++
      }
      const layerContent = code.slice(brace + 1, pos - 1)
      result += unwrapCssLayers(layerContent)
      i = pos
    } else {
      result += code[i]
      i++
    }
  }
  return result
}

function legacyBrowserCssPlugin(): Plugin {
  return {
    name: 'legacy-smart-tv-css-compatibility',
    enforce: 'post',
    closeBundle() {
      try {
        const assetsDir = path.resolve(process.cwd(), 'dist/assets')
        if (!fs.existsSync(assetsDir)) return

        const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'))
        for (const file of files) {
          const filePath = path.join(assetsDir, file)
          const raw = fs.readFileSync(filePath, 'utf8')
          const unwrapped = unwrapCssLayers(raw)
          const transformed = transform({
            filename: file,
            code: Buffer.from(unwrapped),
            targets: {
              chrome: 60 << 16,
              safari: 12 << 16,
              firefox: 60 << 16,
              edge: 79 << 16,
            },
            minify: true,
          }).code.toString()

          fs.writeFileSync(filePath, transformed, 'utf8')
          console.log(`[Smart TV & Legacy CSS Fix] Transformed ${file}: unwrapped @layer and added standard color fallbacks.`)
        }
      } catch (err) {
        console.error('Error during closeBundle legacy CSS processing:', err)
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacyBrowserCssPlugin(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  build: {
    target: ['es2015', 'chrome60', 'edge79', 'firefox60', 'safari12'],
    cssTarget: ['chrome60', 'firefox60', 'safari12'],
  },
})

