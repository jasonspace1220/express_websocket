const express = require("express");
const socket = require("socket.io");
var cmd = require('node-cmd');
var cors = require('cors');
require('dotenv').config()

var FbComment = require("./model/FbComment");

// App setup
const PORT = 9999;
const app = express();
app.use(cors());

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

    socket.on("run python", async function (data) {
        let fbcomment = new FbComment()
        await fbcomment.updateOne("status = 2", `id = ${data.fb_comment_id}`)

        let dockerCmd = `sudo docker run -e db_host=${process.env.DB_HOST} -e db_user=${process.env.DB_USER} -e db_password=${process.env.DB_PASSWORD} -e db_database=${process.env.DB_DATABASE} -e fb_message_id=${data.fb_comment_id} mypython`
        let cmdData = cmd.runSync(dockerCmd)

        await fbcomment.updateOne("status = 2", `id = ${data.fb_comment_id}`)
        await socketStatusChange(socket);
        // let fbcomment = new FbComment()
        // let all = await fbcomment.selectAllData();
        // socket.emit("status change", {
        //     data: all
        // })
    })

    setInterval(async () => {
        await socketStatusChange(socket);
    }, 10000)

    socket.on('disconnect', (reason) => {
        // ...
    });
});

async function socketStatusChange(socket) {
    let fbcomment = new FbComment()
    let all = await fbcomment.selectAllData();
    socket.emit("status change", {
        data: all
    })
}