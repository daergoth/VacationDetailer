var express = require('express');
var db = require('../../db');
const shortid = require('shortid')

var router = express.Router();

router.post('/', function (req, res, next) {
    let newTrip = req.body.trip;

    newTrip["id"] = shortid.generate();

    db.get('trips')
        .push(newTrip)
        .write();


    res.json({ id: newTrip.id });
});

module.exports = router;
