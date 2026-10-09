
const crypto=require('crypto');
const fs=require('fs');

const SESSION_FILE='./data/sessions.json';
function loadSessions(){
    try{
        //{test:'asdf'}=> object
        return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
    }catch{
        return {};// dobijes const sessions={};   nemoze null.push al ovo moze
    }
}
function saveSessions(sessions){
    fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions, null, 2));
}
const sessions=loadSessions();

function createSession(userID){
    const sessionId=crypto.randomUUID();  //random set brojeva i slova
    sessions[sessionId]={userID:userID, createdAt:Date.now()};
    saveSessions(sessions);
    return sessionId;
}
function getSession(req){
    const cookie = req.headers.cookie || '';
    //sid=2cwedc22df3r3fvr4g65g6h67
    const match=cookie.match(/sid=([^;]+)/);
    if(!match)return null;
    return sessions[match[1]] || null;
}
function deleteSession(userId){
    for(const id in sessions){
        if(sessions[id].userId===userId){
            delete sessions[id];
            saveSessions(sessions);
            break;
        }
    }
    return 'sid=; HttpOnly; Path=/; Max-Age=0';
}
function addToCart(userId, productId){
    const session=Object.values(sessions).find(s=>s.userId===userId);
    if(!session){
        return false;
    }
    if(!Array.isArray(session.shoppingCart)){
        session.shoppingCart=[];
    }
    session.shoppingCart.push(productId);
    saveSessions(sessions);
    return true;
}
module.exports={sessions, createSession,getSession, deleteSession,addToCart};