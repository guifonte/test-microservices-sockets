const express = require('express');
const app = express();
const path = require('path');
var http = require('http').createServer(app);
const axios = require('axios').default;

var redis = require("redis");
var sub = redis.createClient({ host: 'redis', port: 6379 });

var io = require('socket.io').listen(http)
var redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: 'redis', port: 6379 }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
})

sub.on("message", (channel, message) => {
    console.log("sub channel " + channel + ": " + message);
    if (channel == 'counter-update'){
        obj = JSON.parse(message)
        io.to(obj.id).emit('chat message', obj.progress + ": " + obj.id)
    }
})

app.get('/', (req, res, next) => {
    axios.get("http://python:5000/").then(response => {
        res.render('index', {text: response.data})
    }).catch(error => {
        res.render('index', {text: "No Hello World!"})
    })
})

io.on('connection', socket => {
    console.log('a user connected with id: ' + socket.id)
    io.emit('chat message', socket.id +" CONNECTED!")
    axios.post("http://python:5000/",{id: socket.id}).then(response=>{
        console.log(response.data)
        socket.on('chat message', function(msg){
            io.emit('chat message', socket.id+": "+msg);
            console.log('message: ' + msg);
          });
        socket.on('disconnect', function(){
            console.log('user with id: ' + socket.id + ' disconnected');
          });
    }).catch(error => {console.log(error)})
});


//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
sub.subscribe("counter-update");

module.exports = http;
