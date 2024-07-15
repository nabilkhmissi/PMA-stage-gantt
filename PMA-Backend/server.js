const https = require("https");
const http = require('http')
const app = require("./app");
const fs = require("fs");
const config = require("./src/config/config")


const options={
    key: fs.readFileSync('./src/cert/prologic2023.key'),
    cert:fs.readFileSync('./src/cert/.prologic.com.tn.pem')
}
const port = config.PORT;
app.set("port", port);
console.log(`*** ${config.NODE_ENV} ***`)
if(config.NODE_ENV == 'production'){
    const server = https.createServer(options,app);
    server.listen(port, () => console.log(`==== SERVER RUNNING ON PORT ${port}`));
}else{
    server = http.createServer(app);
    server.listen(port, () => console.log(`==== SERVER RUNNING ON PORT ${port}`));
}
