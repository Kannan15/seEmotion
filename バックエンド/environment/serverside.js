const express = require('express');
const app = express();
const assert = require("assert");
const kuromojin = require("kuromojin");
const analyze = require("negaposi-analyzer-ja");
var server = require('http').createServer(app);
const io = require('socket.io')(server);

const negaposi = async (text) => {
    const tokens = await kuromojin(text);
    
    const tokensBasic = await Promise.all(tokens.map(async (token) => {
        if(token.basic_form != '*') {
            const tokenBasic = await kuromojin(token.basic_form);
    
            return tokenBasic[0];
        }
        else {
            return token
        }
    }));

    const analyzeData = await analyze(tokensBasic)

    analyzeData.isKnownWord.forEach(function (existScore, index) {
        tokensBasic[index].exist_score = existScore
    })

    const data = {
        tokens: tokensBasic,
        value: analyzeData.score
    }

    return data;
};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
    (async () => {
        const data = await negaposi(req.query.value);
        res.send(data.value.toString());
    })();
});

app.get('/dev', function (req, res) {
    (async () => {
        const data = await negaposi(req.query.value);
        res.json(data);
    })();
});

app.get('/dict', function (req, res) {
    const dict = require("negaposi-analyzer-ja/dict/pn_ja.dic.json");
    res.json(dict);
});

const port = 3000;

server.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

io.on('connection', function(socket){
    socket.on('message', function(msg){
        io.emit('message', msg);
    });
    socket.on('pin', function(pin){
        io.emit('pin', pin);
    });
});
