// look again at the sync and async type of file reading and writing

const os = require("os");

const user = os.userInfo();

console.log(user);

const some = os.networkInterfaces();

console.log(some);
