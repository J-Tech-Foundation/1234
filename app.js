const http = require('http')
, express = require('express')
, bp = require('body-parser')
, Kahoot = require('kahoot.js-updated')
, app = express();

app.listen(80);

app.use(bp.json());
app.use(bp.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/break', (req, res) => {
  var pin = parseFloat(req.body.pin)
  , name = req.body.name
  , amt = parseInt(req.body.amt);

  function add(i) {

    client = new Kahoot;

    client.join(pin, name + i)

    client.on('questionStart', question => {
      question.answer(0);
    });

    if (i >= amt) return;

    setTimeout(() => add(i + 1), 100);
  }

  add(0);
});
