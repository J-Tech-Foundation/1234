const http = require('http')
, express = require('express')
, bp = require('body-parser')
, pug = require('pug')
, Kahoot = require('kahoot.js-updated')
, app = express();

const server = http.createServer(app).listen(process.env.PORT || 80);

app.use(bp.json());
app.use(bp.urlencoded({
  extended: true
}));

app.set('view engine', 'pug');
app.set('views', './');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/break', (req, res) => {
  var pin = parseFloat(req.body.pin)
  , name = req.body.name
  , amt = parseInt(req.body.amt);

  function spawn(i) {

    client = new Kahoot;

    client.join(pin, name + i);

    client.on('questionStart', question => {
      question.answer(0);
    });

    if (i >= amt) return;

    setTimeout(() => spawn(i + 1), 50);
  }

  spawn(0);
});
