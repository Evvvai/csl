const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const { readFileSync } = require('fs')
const { join } = require('path')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const httpsOptions = {
  key: readFileSync(join(__dirname, './ssl/', 'key.pem')),
  cert: readFileSync(join(__dirname, './ssl/', 'cert.pem')),
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(process.env.PORT, (err) => {
    if (err) throw err
    console.log('> Server started on https://localhost:' + process.env.PORT)
  })
})
