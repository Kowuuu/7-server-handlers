const fs = require('fs');
const path = require('path');

const IMG_TYPES = ['jbg', 'jpeg', 'gif', 'webp', 'png', 'webp'];
const MIME_TYPES={
    'jpg':'image/jpeg',
    'jpeg':'image/jpeg',
    'png': 'image/png',
    'gif':'image/gif',
    'webp':'image/webp',
        }

function handleStaticFiles(req, res) {
        const filePath = path.join(__dirname, '../..', req.url);

        if (req.url.includes('/img')) {
            const extension = path.extname(req.url).toLowerCase().replace('.', '')

            if (!IMG_TYPES.includes(extension)) {
                throw new Error("This image format is not suported")
            }
            handleFileLoad(filePath,res,extension);

    } else if (req.url.includes('/js')) {
        handleFileLoad(filePath, res);
    } else if (req.url.includes('css')) {
        handleFileLoad(filePath, res);
    } else {
        throw new Error("You dont have premision to load from this folder")
    }
    return true;
}

function handleFileLoad(filePath, res, extension='') {
    fs.readFile(filePath, extension===''?'utf8':'', (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            return res.end('File not found')
        }
        let contentType=null;
        if(filePath.endsWith('.js') || filePath.endsWith('.css')) {
            contentType = filePath.endsWith('.js') ? 'application/javascript' : 'text/css';
        }else{
            if(extension!=='' ) {
                contentType=MIME_TYPES[extension];
            }
        }
        if(contentType===null){
            throw new Error("Invalid content type")
        }


        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);
    })
}

function handleImageFiles() {

}


module.exports = {handleStaticFiles};





















