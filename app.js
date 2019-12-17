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

io.on('connection', (socket) => {
  socket.on('spawn', (dataString) => {
    let data = JSON.parse(dataString);

    var pin = parseFloat(data.pin)
    , name = data.name
    , amt = parseInt(data.amt);

    function spawn(i) {

      let client = new Kahoot;

      client.join(pin, name + i);

      client.on('question', question => {

        question.answer(0);
      });

      setTimeout(() => spawn(i + 1), 50);
    }

    spawn(1);
  })
});

app.get('/', (req, res) => {
  res.render('index');
});
