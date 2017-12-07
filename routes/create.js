var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('create',
    {
      title: "Create new trip",
      googleApiKey: process.env.GOOGLE_MAPS_API_KEY
    });
});

module.exports = router;
