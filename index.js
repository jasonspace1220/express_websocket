const express = require("express");
const socket = require("socket.io");
var cmd = require('node-cmd');
var cors = require('cors');
require('dotenv').config()
var mysql = require('mysql');

// App setup
const PORT = 9999;
const app = express();
app.use(cors());

// Mysql 
​
// connect MySQL
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
 

const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});


// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server, {
    cors: {
        origin: '*',
    }
});

io.on("connection", function (socket) {

    socket.on("run python", function (data) {
        let dockerCmd = `sudo docker run -e db_host=${process.env.DB_HOST} -e db_user=${process.env.DB_USER} -e db_password=${process.env.DB_PASSWORD} -e db_database=${process.env.DB_DATABASE} -e fb_message_id=${data.fb_comment_id} mypython`
        let cmdData = cmd.runSync(dockerCmd)
        socket.emit("data", {
            text: cmdData.data
        })
        console.log(cmdData.data);
    })
});