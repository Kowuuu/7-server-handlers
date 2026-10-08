
const fs = require("fs");
const filePath=require('path');
const path = require("path");

function logFile(file,message){
    const now=new Date().toISOString();
    const formattedMessage =`[${now}] ${message} \n`
    const logPath=path.join(__dirname,`../../storage/${file}.log`)
    fs.appendFile(logPath,formattedMessage,(err)=>{})
}
module.exports=logFile;