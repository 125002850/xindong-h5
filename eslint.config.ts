import { readFile } from 'node:fs/promises'
import lincy from '@lincy/eslint-config'

const autoImport = JSON.parse((await readFile(new URL('./.eslintrc-auto-import.json', import.meta.url))).toString())

const config = await lincy(
  {
    unocss: true,
    formatters: {
      css: false,
      graphql: true,
      html: true,
      markdown: true,
    },
    toml: false,
    ignores: ['**/assets', '**/static'],
  },
  {
    languageOptions: {
      globals: {
        ...autoImport.globals,
      },
    },
  },
  {
    rules: {
      'style/indent': 'off',
      'style/brace-style': 'off',
      'vue/html-indent': 'off',
      'antfu/if-newline': 'off',
    },
  },
)

export default config
