const http = require('http')
, https = require('https')
, express = require('express')
, bp = require('body-parser')
, pug = require('pug')
, Kahoot = require('kahoot.js-updated')
, app = express();

const server = http.createServer(app).listen(process.env.PORT || 80);
const io = require('socket.io')(server);

app.use(bp.json());
app.use(bp.urlencoded({
  extended: true
}));

app.set('view engine', 'pug');
app.set('views', './');

function spawn(i, pin, name, amt) {

  let client = new Kahoot;

  console.log(typeof(pin), name + i);

  client.join(pin, name + i);

  client.on('questionStart', question => {

    question.answer(0);
  });

  if (i >= amt) return;

  setTimeout(() => spawn(i + 1, pin, name, amt), 50);
}

io.on('connection', (socket) => {
  socket.on('spawn', (dataString) => {
    let data = JSON.parse(dataString);

    var pin = parseFloat(data.pin)
    , name = data.name
    , amt = parseInt(data.amt);

    spawn(1, pin, name, amt);
  });

  socket.on('join', room => {
    socket.join(room);
  })
});

app.get('/', (req, res) => {
  res.render('index');
});
