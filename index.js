//za staticke stvari (javascript fajlovi,json) static handler
//za stranice (/home, /about, /contact, /shop....) pagehandler
//za apije je apihandler

const http=require('http')
const{handleStaticFiles}=require('./src/handlers/staticHandler')
const {handleApiCall}=require('./src/handlers/apiHandler')
const {handlePage}=require('./src/handlers/pageHandler')
require('./src/listeners/pageListener')

const server=http.createServer((req,res)=>{

    //sve sto ide u /public/ ide u staticHandler
    if(req.url.startsWith('/public/')){
        handleStaticFiles(req,res);
        return;
    }else if(req.url.startsWith('/api/')) {
        handleApiCall(req, res);
        return;
    }
    if(req.url === '/'){
        handlePage(req,res);
        return;
    }
            res.writeHead(404,{'Content-Type':'text/plain'});
            return res.end ("404 page not found")


})
server.listen(3000,()=>console.log("server working on port 3000"))




















