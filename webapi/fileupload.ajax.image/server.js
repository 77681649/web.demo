const http = require('http')
const fs = require('fs')
const { use, exec } = require('connect')
const renderIndex = (req, res) => {
  fs.createReadStream('./index.html').pipe(res)
}
const handleImageUpload = (req, res) => {
  let file = req.body.file

  if (file) {
    let extension = ({ 'image/png': '.png', 'image/gif': '.gif', 'image/jpg': '.jpg' })[file.type]
    let filepath = require('path').join(__dirname, 'upload', (file.filename || (new Date().getTime()).toString() + extension))

    fs.writeFile(filepath, Buffer.from(file.value,'latin1'), function (err) {
      let resp

      if (err) {
        resp = { errCode: 500, errMessage: err.message }
      } else {
        resp = { errCode: 0 }
      }

      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(resp))
    })
  }
}

use(require('http-handler/static-file')('public', __dirname))
use(require('http-handler/body'))
use(require('http-handler/cors'))
use(require('http-handler/form-data'))
use('/image/upload', 'POST', handleImageUpload)
use(require('http-handler/not-found'))

http.createServer(exec).listen(3000, function onListen() {
  console.log('server is started. port:3000')
})

