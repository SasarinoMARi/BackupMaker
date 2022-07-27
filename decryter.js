require("dotenv").config();
const fs = require('fs');
const path = require("path");
const crypto = require('crypto');
const encrypt_key = Buffer.from(process.env.ENCRYPT_KEY);

function decrypt(text) {
    console.log(text);
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv( 
        'aes-256-cbc', encrypt_key, iv,
    );

    const decrypted = decipher.update(encryptedText);

    return Buffer.concat([decrypted, decipher.final()]).toString();
}

const decryptedFilePath = `${__dirname}/decrypted`;
if (!fs.existsSync(decryptedFilePath)) {
    fs.mkdirSync(decryptedFilePath);
}

if (process.argv.length >= 2) {
    let paths = process.argv.slice(2);
    if (paths.length > 0) {
        paths.forEach(p => {
            if (fs.existsSync(p)) {
                let outFilename = `${decryptedFilePath}/${path.basename(p)}.dec`;
                let encByte = fs.readFileSync(p);
                let encText = new Buffer.from(encByte).toString();
                let decrypted = decrypt(encText);
                fs.writeFileSync(outFilename, decrypted);
            }
        });
    }
}