const express = require('express');
const app = express();
const server = require('http').createServer(app);
const routing = require('./Routes/public');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../Public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/../Public/index.html", (err) => {
        console.log(err)
    })
})

app.use(routing);


const PORT = 5510;
server.listen(PORT, () => {
    console.log('Boogle Search Online on Port: ' + PORT);
})