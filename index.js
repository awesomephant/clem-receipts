const fs = require('fs')
const express = require('express')
const escpos = require('escpos');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const device  = new escpos.USB();
const options = { encoding: "utf-8" /* default */ }
const printer = new escpos.Printer(device, options);

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/thankyou', function (req, res) {
    res.sendFile(__dirname + '/thankyou.html');
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

const dataFile = './submissions.json'

class Submission {
    constructor(words, date) {
        this.words = words;
        this.date = date;
    }
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function printWords(words) {
  device.open(function(){
    printer
    .font('a')
    .align('ct')
    .style('bu')
    .size(1, 1)
    .text("Glossary\n")
    .text(words.join("\n"))
    .close()
  });
}

function pickRandomSubmission(data){
  return data[getRandomInt(0,data.length - 1)]
}

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('submission', function (words) {
        console.log(words)
        let data = JSON.parse(fs.readFileSync(dataFile))
        data.submissions.push(new Submission(words, Date.now()))
        fs.writeFileSync(dataFile, JSON.stringify(data))
        let randomWords = pickRandomSubmission(data.submissions)
        console.log(randomWords)
        setTimeout(function(){
          printWords(randomWords.words)
        }, 4000)

    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

//printWords()
