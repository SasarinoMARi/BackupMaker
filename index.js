const databases = [
    "spcm",
    "memoboard",
    "diary"
];

require("dotenv").config();
const fs = require('fs');
const time = require("./time");
const crypto = require('crypto');
const encrypt_key = Buffer.from(process.env.ENCRYPT_KEY);

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        'aes-256-cbc', encrypt_key, iv,
    );

    const encrypted = cipher.update(text);

    return (
        iv.toString('hex') +
        ':' +
        Buffer.concat([encrypted, cipher.final()]).toString('hex')
    );
}

function cmd(command) {
    const { execSync } = require("child_process");
    execSync(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        
        if(!isEmptyOrSpaces(stdout))
            console.log(stdout);
    });
}
function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

let out_prefix = `${time().format("YYYYMMDD_HHmm_")}`;
const dir_name = `${__dirname}/backup`;
if (!fs.existsSync(dir_name)) {
    fs.mkdirSync(dir_name);
}

databases.forEach(database => {
    let out_filename = `${dir_name}/${out_prefix}${database}.backup`;
    let command = `mysqldump -h ${process.env.DESTINATION_IP} -P ${process.env.DESTINATION_PORT} ${database} > ${out_filename}`;
    cmd(command);

    if (fs.existsSync(out_filename)) {
        let out_enc_filename = `${out_filename}.enc`;
        // TODO: 지금은 파일 전체 읽는게 문제없지만 나중에 파일 용량이 커지면 이런 식의 처리는 힘들지도?
        let data = fs.readFileSync(out_filename);

        fs.rmSync(out_filename);

        let encryptedData = encrypt(data);
        fs.writeFileSync(out_enc_filename, encryptedData);
    }
})