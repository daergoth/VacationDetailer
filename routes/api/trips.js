var express = require('express');
const db = require("../../db");

var router = express.Router();

router.get('/:tripId', function (req, res, next) {

    let trip = db.get("trips")
        .find({ id: req.params.tripId })
        .value();

    res.json({
        trip
    });
});

router.delete('/:tripId', function(req, res, next) {
    db.get("trips")
        .remove({id: req.params.tripId})
        .write();

    res.status(200).end();
});

module.exports = router;
