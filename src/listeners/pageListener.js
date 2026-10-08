import emitter from "../events/emitter.js";
import logFile from "../helpers/logHelper.js";

emitter.on('page:success',()=>{
    logFile("pageLoadSuccess","File is loaded");
});
emitter.on('page:fail',()=>{
    logFile("pageLoadFail","File failed to load");
});