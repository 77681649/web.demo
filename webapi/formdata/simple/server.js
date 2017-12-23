const http = require('http')
const fs = require('fs')
const formDateHandler = require('http-handler/form-data')
const corsHandler = require('http-handler/cors')

http.createServer(function (req, res) {
  corsHandler(req,res,function(){
    if (req.url.toLowerCase() == '/post' && req.method == 'POST') {
      let chunks =[]

        req.on('data', function (chunk) {
          chunks.push(chunk)
        })

      req.on('end', function (chunk) {
        if(chunk) chunks.push(chunk)

        req.body = Buffer.concat(chunks).toString('utf-8')
        formDateHandler(req,res,function(err,fields){
          res.setHeader('Content-Type','content="text/html; charset=UTF-8')
          if(fields.username === 'text' && fields.password === 'test'){
            res.end('登录成功')
          }else{
            res.end('登录失败')
          }
        })
      })
    } else {
      res.statusCode = 404
      res.end()
    }
  })
}).listen(3000)