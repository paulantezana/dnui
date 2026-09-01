import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const coreDir = fileURLToPath(new URL('../src/core/', import.meta.url))

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (/\.[cm]?tsx?$/.test(entry.name)) out.push(full)
  }
  return out
}

const FROM_REACT = /(?:^|\n)\s*(?:import|export)[^\n;]*?from\s*['"](?:react|react-dom)(?:\/[^'"]*)?['"]/
const BARE_REACT = /(?:^|\n)\s*import\s*['"](?:react|react-dom)(?:\/[^'"]*)?['"]/
const DYNAMIC_REACT = /(?:import|require)\(\s*['"](?:react|react-dom)(?:\/[^'"]*)?['"]\s*\)/

const files = walk(coreDir)
const problems = []

for (const file of files) {
  const rel = relative(process.cwd(), file).split(sep).join('/')
  if (/\.tsx$/.test(file)) {
    problems.push(`${rel} — src/core/ no puede contener JSX (.tsx)`)
    continue
  }
  const src = readFileSync(file, 'utf8')
  if (FROM_REACT.test(src) || BARE_REACT.test(src) || DYNAMIC_REACT.test(src)) {
    problems.push(`${rel} — importa React`)
  }
}

if (problems.length > 0) {
  console.error('src/core/ debe ser TypeScript puro, sin React. Problemas:')
  for (const p of problems) console.error('  - ' + p)
  process.exit(1)
}

console.log(`check:core ok — ${files.length} archivo(s) en src/core/, ninguno depende de React`)
