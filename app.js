var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var baseDirectory = __dirname
var excel = require('excel-stream')

//server configuration
var server = http.createServer(function (request, response) {
  try {
    var requestUrl = url.parse(request.url)
    //normalize
    var fsPath = baseDirectory+path.normalize(requestUrl.pathname)
    if (fs.statSync(fsPath).isDirectory()) fsPath += '/index.html';

    var fileStream = fs.createReadStream(fsPath)
      fileStream.pipe(response)
      fileStream.on('open', function() {
           response.writeHead(200)
      })
      fileStream.on('error',function(e) {
           response.writeHead(404)
           response.end()
      })
    } catch(e) {
      response.writeHead(500)
      response.end()
      console.log(e.stack)
    }
});

//start filestream -> json
init(() => {
fs.createReadStream('accounts.xlsx')
  .pipe(excel())  // same as excel({sheetIndex: 0})
  .on('data', console.log)
});

//refresh json data
var clientUpdate = function (){

};



//socketio configuration
var io = require('socket.io')(server);
server.listen(port);
console.log('Server on @ port: '+port);
io.on('connect', function(client) {
  console.log('Client connected...');
  clientUpdate();

  //client.on('toggle', function(data) {
    //toggle(data);
  //});

  //setInterval(clientUpdate, 500);
});
