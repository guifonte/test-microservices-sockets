const express = require('express')
const axios = require('axios').default;
const app = express()

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

app.get('/', (req, res, next) => {
    axios.get("http://python:5000/").then(response => {
        res.send(response.data)
    }).catch(error => {
        res.send("No Hello World!")
    })
})

//app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app;
