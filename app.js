const express = require('express')
, bp = require('body-parser')
, pug = require('pug')
, Kahoot = require('kahoot.js-updated')
, app = express();

const server = app.listen(process.env.PORT || 80);
const io = require('socket.io')(server);

app.use(bp.json());
app.use(bp.urlencoded({
  extended: true
}));

app.set('view engine', 'pug');
app.set('views', './');

function spawn(i, pin, name, amt) {

  let client = new Kahoot;

  client.join(pin, name + i);

  client.on('questionStart', question => {

    question.answer(0);
  });

  setTimeout(() => spawn(i + 1, pin, name, amt), 50);
}

io.on('connection', (socket) => {
  socket.on('spawn', (dataString) => {
    let data = JSON.parse(dataString);

    var pin = parseFloat(data.pin)
    , name = data.name
    , amt = parseInt(data.amt);
    
    console.log(pin, name, amt)

    spawn(1, pin, name, amt);
  });

  socket.on('join', room => {
    socket.join(room);
  })
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/answers')
