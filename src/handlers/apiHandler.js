
const {createUser, userExists,getUserByEmail}=require('../services/userService')
const bcrypt =require('bcrypt');
const {createSession}=require('../services/sessionService')
const querystring = require("node:querystring");

async function handleApiCall(req, res) {
    const urlMatch = req.url.match(/^\/api\/([\w-]+)$/);

    if (urlMatch[1] === 'register' && req.method==="POST"){
        let body="";
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const formData= querystring.parse(body);

            const errors=[]
            if(!formData.name ||formData.name.length<3){
                errors.push("Name is required and atleast be 3 characters");
            }
            if(!formData.email || !formData.email.includes('@')){
                errors.push("Email must be set and valid");
            }
            if(!formData.agreeRules){
                errors.push("you must agree with site rules");
            }
            if(formData.password && formData.confirmPassword){
                if(formData.password !==formData.confirmPassword){
                    errors.push("Passwords do not match");
                }
            }
            if(errors.length===0 && await userExists(formData.email)){
                errors.push("Email is already in use");
            }
            if(errors.length>0){
                res.writeHead(400,{'Content-Type':'application/json'});
                return res.end(JSON.stringify(errors));
            }

            const password=await bcrypt.hash(formData.password, 10);

            const userId=await createUser(formData.name, formData.email, password);
            const sessionID=createSession(userId);
            res.setHeader('Set-Cookie', `sid=${sessionID}; HttpOnly; path=/`);

            res.writeHead(200,{'Content-Type':'application/json'});
            return res.end(JSON.stringify({success:true, message:"Successfully registered"}));
        })
        return;
    }
    else if(urlMatch[1]==="login" && req.method==="POST"){
        let body="";
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const formData = querystring.parse(body);
            const errors=[]
            if(!formData.email || !formData.email.includes('@')){
                errors.push("Email must be set and valid");
            }
            if(!formData.password || !formData.password.length>3){
                errors.push("Passwords does not match");
            }
            if(errors.length>0){
                res.writeHead(400,{'Content-Type':'application/json'});
                return res.end(JSON.stringify(errors));
            }
            const user=await getUserByEmail(formData.email);

            if(!user){
                res.writeHead(400,{'Content-Type':'application/json'});
                return res.end(JSON.stringify({success:false, message:"This user doesent exist"}));
            }
            const passwordMatch= await bcrypt.compare(formData.password, user.password);
            if(!passwordMatch){
                res.writeHead(400,{'Content-Type':'application/json'});
                return res.end(JSON.stringify({success:false, message:"Invalid password"}));
            }

            const sessionID=createSession(user.id);

            res.setHeader('Set-Cookie', `sid=${sessionID}; HttpOnly; path=/`);
            res.writeHead(200,{'Content-Type':'application/json'});
            return res.end(JSON.stringify({success:true, message:"Successfully logged in"}));
        });
        return;
    }

    const response={success:true}
    const data=JSON.stringify(response);

    res.writeHead(200,{'Content-Type':'application/json'});
    res.end(data)
}
module.exports ={handleApiCall}