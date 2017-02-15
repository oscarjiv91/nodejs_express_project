var express = require('express');
var router = express.Router();

var api_key = 'XXX';
var domain = 'XXX';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

// Sendmail route
router.post('/sendmail', function(req, res){

  var data = {
    from: "hello@appsboulevard.com",
    to: "hello@appsboulevard.com",
    subject: 'Apps Boulevard Website',
    text: req.body.text
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
    if(error){
      res.send(req.body);
    }else{
      res.send(error);
    }
  });

});

module.exports = router;
