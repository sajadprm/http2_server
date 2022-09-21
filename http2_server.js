
const http2 = require('http2')
const fs=require("fs");
const path=require("path");
const mime=require("mime-types")
const port=8443;

const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_METHOD,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR

}=http2.constants

const options={
  key:fs.readFileSync("./public/key.pem"),
  cert:fs.readFileSync("./public/cert.pem")
}

// create a new server instance
const server = http2.createSecureServer(options)

const serverRoot="./public"

const respondToStreamError=(err,stream)=>{
  console.log(err);
  if(err.code==="ENOENT")
  {
    stream.respond({ ":status":HTTP_STATUS_NOT_FOUND});
  }else
  {
    stream.respond({ ":status":HTTP_STATUS_INTERNAL_SERVER_ERROR})
  }
  stream.end()
}

server.on('stream', (stream, headers) => {

  const reqPath=headers[HTTP2_HEADER_PATH];
  const reqMethod=headers[HTTP2_HEADER_METHOD];
  const fullPath=path.join(serverRoot,reqPath);
  const responseMimeType=mime.lookup(fullPath);

  if(fullPath.endsWith(".html"))
  {
    console.log("html");
    
      stream.respondWithFile(fullPath,{
        'Content-Type':"text/html"
      },{
        onError:(err)=>respondToStreamError(err,stream)
      })

      stream.pushStream({ ":path": "/style.css"},{parent:stream.id},(pushStream)=>{
        console.log("pushing...");
        const  pushingFilePath=path.join(serverRoot,"/style.css");
        pushStream.respondWithFile(pushingFilePath,{
          "Content-type":"text/css"
        },{
          onError:(err)=>{
            respondToStreamError(err,pushStream)
          }
        });

      });


  }
  

  stream.respondWithFile(fullPath,{
    'Content-Type':responseMimeType
  },{
    onError:(err)=>respondToStreamError(err,stream)
  })

})
server.listen(port,()=>{
    console.log(`Server Running on Port ${port}`)
})