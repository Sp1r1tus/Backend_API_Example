"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var morgan = require('morgan'); // logger Middleware
var bodyParser = require('body-parser'); // http, json but no file request
var Route = require('./API/Persons');
var Route2 = require('./API/Meetings');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // Domäne entry for invalid user access
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
app.use('/Persons', Route);
app.use('/Meetings', Route2);
app.use(function (req, res, next) {
    var error = new Error('Not Found');
    //error.status = 404;
    next(error);
});
app.use(function (error, req, res, next) {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;
//# sourceMappingURL=app.js.map