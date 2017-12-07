const express = require('express');
const db = require("../db");

const router = express.Router();

router.get("/", function (req, res, next) {
    let trips = db.get("trips").value();

    res.render('trips',
        {
            title: 'My saved trips',
            trips
        }
    );
});

router.get("/:tripId", function (req, res, next) {
    let trip = db.get("trips")
        .find({ id: req.params.tripId })
        .value();

    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

    res.render('single-trip',
        {
            title: trip.name,
            places: trip.places.map((p, i) => {
                p.icon = alphabet[i];
                return p;
            }),
            googleApiKey: process.env.GOOGLE_MAPS_API_KEY
        }
    );
});

module.exports = router;
