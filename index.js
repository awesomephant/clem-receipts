const fs = require('fs')
const express = require('express')
const escpos = require('escpos');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//const device  = new escpos.USB();
//const options = { encoding: "utf-8" /* default */ }
//const printer = new escpos.Printer(device, options);

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/thankyou', function (req, res) {
    res.sendFile(__dirname + '/thankyou.html');
});
app.get('/about', function (req, res) {
    res.sendFile(__dirname + '/about.html');
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
    device.open(function () {
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

function pickRandomWords(submissions) {
    let allWords = [];
    let picks = []
    let pickCount = 5;
    console.log(submissions)
    for (let i = 0; i < submissions.length; i++) {
        for (let j = 0; j < submissions[i].words.length; j++) {
            allWords.push(submissions[i].words[j])
        }
    }

    console.log(allWords)
    while (picks.length < pickCount) {
        let word = allWords[getRandomInt(0, allWords.length - 1)]
        let result = true
        for (let i = 0; i < picks.length; i++){
            if (word === picks[i]) {
                result = false;
            }
        }
        if (result){
            console.log(picks)
            picks.push(word)
        }
    }
    
    console.log('Final Picks')
    console.log(picks)
    return picks;
}

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('submission', function (words) {
        console.log(words)
        let data = JSON.parse(fs.readFileSync(dataFile))
        let randomWords = pickRandomWords(data.submissions)

        data.submissions.push(new Submission(words, Date.now()))
        fs.writeFileSync(dataFile, JSON.stringify(data))
        console.log(randomWords)
        //        setTimeout(function () {
        //       console.log(randomWords)
        //printWords(randomWords.words)
        //      }, 4000)

    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

//printWords()
