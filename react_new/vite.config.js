import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const FAIL_LOG = path.join(rootDir, 'vite-click-failures.log')
const ALL_LOG = path.join(rootDir, 'vite-click-all.log')

const BO_ORIGIN = 'https://34.18.92.50:8444'
const DATA_ORIGIN = 'http://34.18.92.50:8443'
const BO_PATH = '/backoffice-insurance'
const SERVICE_PATH = '/backoffice-service'
const WFC_PATH = '/workflow-insurance'

const PRE_LOGIN_COOKIE_STRIP =
  /auth-server\/(public\/rp|login|mfavalidation|otpverification)|token\/generate/i

function stamp() {
  return new Date().toISOString()
}

function appendLine(file, line) {
  try {
    fs.appendFileSync(file, line + '\n')
  } catch {}
}

function rewriteSetCookie(proxyRes) {
  const raw = proxyRes.headers['set-cookie']
  if (!raw) return
  const list = Array.isArray(raw) ? raw : [raw]
  proxyRes.headers['set-cookie'] = list.map((c) =>
    String(c)
      .replace(/;\s*Secure/gi, '')
      .replace(/;\s*Domain=[^;]*/gi, '')
      .replace(/;\s*SameSite=None/gi, '; SameSite=Lax')
      .replace(/;\s*HttpOnly/gi, ''),
  )
}

function attachFailLogger(proxy, label) {
  proxy.on('proxyRes', (proxyRes, req) => {
    rewriteSetCookie(proxyRes)
    const method = (req.method || 'GET').toUpperCase()
    const url = req.url || ''
    const status = proxyRes.statusCode || 0
    const chunks = []
    proxyRes.on('data', (c) => {
      if (chunks.length < 40) chunks.push(c)
    })
    proxyRes.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8').slice(0, 400)
      let biz = ''
      let desc = ''
      try {
        const j = JSON.parse(raw)
        biz = j?.status?.code != null ? String(j.status.code) : ''
        desc = j?.status?.description ? String(j.status.description).slice(0, 120) : ''
      } catch {}
      const softFail =
        status >= 400 ||
        (biz && biz !== '000000') ||
        (status === 200 && !raw.trim())
      const line = `${stamp()} [${label}] ${status} biz=${biz || '-'} ${method} ${url}${desc ? ' :: ' + desc : ''}${softFail && raw ? ' | ' + raw.replace(/\s+/g, ' ').slice(0, 180) : ''}`
      appendLine(ALL_LOG, line)
      if (softFail) appendLine(FAIL_LOG, line)
    })
  })
}

function proxyHooks(label) {
  return {
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq, req) => {
        const url = req.url || ''
        if (PRE_LOGIN_COOKIE_STRIP.test(url)) {
          proxyReq.removeHeader('cookie')
          proxyReq.removeHeader('x-managed-cookie')
          return
        }
        const managed = req.headers['x-managed-cookie']
        if (managed) {
          const existing = proxyReq.getHeader('cookie')
          const merged = existing ? `${existing}; ${managed}` : String(managed)
          proxyReq.setHeader('cookie', merged)
          proxyReq.removeHeader('x-managed-cookie')
        }
      })
      attachFailLogger(proxy, label)
    },
  }
}

export default defineConfig(({ mode }) => {
  loadEnv(mode, rootDir, '')
  try {
    fs.writeFileSync(FAIL_LOG, `# SoftFetch/API click failures\n# started ${stamp()}\n`)
    fs.writeFileSync(ALL_LOG, `# All proxied API calls\n# started ${stamp()}\n`)
  } catch {}
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'src'),
        '@assets': path.resolve(rootDir, 'public/assets'),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.js'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/core/**', 'src/components/ui/**', 'src/features/**/services/**'],
      },
    },
    server: {
      proxy: {
        '/data-api': {
          target: DATA_ORIGIN,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
          cookiePathRewrite: '/',
          rewrite: (p) => p.replace(/^\/data-api/, BO_PATH),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('cookie')
              proxyReq.removeHeader('x-managed-cookie')
            })
            attachFailLogger(proxy, 'data')
          },
        },
        // Login audit graph: http://34.18.92.50:8443/backoffice-service/dashboard/graph
        '/service-api': {
          target: DATA_ORIGIN,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
          cookiePathRewrite: '/',
          rewrite: (p) => p.replace(/^\/service-api/, SERVICE_PATH),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('cookie')
              proxyReq.removeHeader('x-managed-cookie')
            })
            attachFailLogger(proxy, 'service')
          },
        },
        '/bo-api': {
          target: BO_ORIGIN,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
          cookiePathRewrite: '/',
          rewrite: (p) => p.replace(/^\/bo-api/, BO_PATH),
          ...proxyHooks('bo'),
        },
        '/wfc-api': {
          target: BO_ORIGIN,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
          cookiePathRewrite: '/',
          rewrite: (p) => p.replace(/^\/wfc-api/, WFC_PATH),
          ...proxyHooks('wfc'),
        },
        // Flutter: const graphql = 'https://34.18.92.50:8444/graphql'
        '/graphql-api': {
          target: BO_ORIGIN,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
          cookiePathRewrite: '/',
          rewrite: (p) => p.replace(/^\/graphql-api/, '/graphql'),
          ...proxyHooks('graphql'),
        },
      },
    },
  }
})
