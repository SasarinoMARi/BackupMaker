const databases = [
    "spcm",
    "memoboard",
    "diary"
];

require("dotenv").config();
const time = require("./time");
function cmd(command) {
    const { exec } = require("child_process");
    exec(command, (error, stdout, stderr) => {
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
databases.forEach(database => {
    let out_filename = `${out_prefix}${database}.backup`;
    let command = `mysqldump -h ${process.env.DESTINATION_IP} -P ${process.env.DESTINATION_PORT} ${database} > backup/${out_filename}`;
    cmd(command);
})