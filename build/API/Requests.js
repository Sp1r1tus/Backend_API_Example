"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
// import fetch from 'node-fetch';  // testing with jsonplaceholder
var router = express.Router();
// for local FileSystem
var fs = require('fs');
router.get('/', function (req, res, next) {
    fs.readFile('./data/Personen.json', 'utf8', function (err, jsonString) {
        var obj = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: err
            });
            return;
        }
        console.log(jsonString);
        res.status(200).json({
            data: obj,
            message: "ALL Personens loaded..."
        });
    });
});
router.get('/:PersonID', function (req, res, next) {
    var id = req.params.PersonID - 1;
    fs.readFile('./data/Personen.json', 'utf8', function (err, jsonString) {
        var obj = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: "File not found!"
            });
            return;
        }
        if (obj[id] !== undefined) {
            res.status(200).json({
                data: obj[id],
                message: "Spezial Person " + id
            });
        }
        else {
            res.status(204).json({
                message: "Person " + id + " not found!"
            });
        }
        ;
    });
});
/* Testing GET API with Jsonplaceholder
router.get('/', (req: express.Request, res: express.Response, next) => {
    GetPersonen(function (recordset) {
        res.status(200).json({
            data: recordset,
            message: "ALL Personens loaded..."
        });
    });
});

 function GetPersonen(callback) {
    fetch("https://jsonplaceholder.typicode.com/users/")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            callback(data)
        });
};

router.get('/:PersonID', (req, res, next) => {
    const id = req.params.PersonID;
    GetPersonByID(id, function (recordset) {
        console.log(recordset)
        if (recordset.id !== undefined) {
            res.status(200).json({
                data: recordset,
                message: "Spezial Person " + id
            });
        } else {
            res.status(204).json({
                message: "ID " + id + " not found!"
            });
        }
    });
});

function GetPersonByID(id, callback) {
    // fetch("./Personen.json")
    fetch("https://jsonplaceholder.typicode.com/users/" + id)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            callback(data)
        });
};

*/
router.delete('/:PersonID', function (req, res, next) {
    var id = req.params.PersonID;
    fs.readFile('./data/Personen.json', 'utf8', function (err, jsonString) {
        var obj = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: "File not found!"
            });
            return;
        }
        if (obj[id - 1] !== undefined) {
            var newData = obj.filter(function (filtor) { return filtor.ID !== obj[id - 1].ID; });
            console.log(newData);
            res.status(200).json({
                data: newData,
                message: "Deleted Id " + id
            });
        }
        else {
            res.status(204).json({
                message: "Person " + id + " not found!"
            });
        }
    });
});
router.post('/', function (req, res, next) {
    fs.readFile('./data/Personen.json', 'utf8', function (err, jsonString) {
        // obj for update or Insert
        var activeObj = req.body;
        var obj = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: "File not found!"
            });
            return;
        }
        if (activeObj.ID === 0) {
            // insert
            activeObj.ID = obj.length + 1;
            var newData = obj.concat(activeObj);
            res.status(201).json({
                data: newData,
                message: 'Insert this Person'
            });
        }
        else {
            // update 
            var newData = obj.filter(function (filtor) { return filtor.ID !== obj[activeObj.ID - 1].ID; }).concat(activeObj);
            res.status(201).json({
                data: newData,
                message: 'Update this Person'
            });
        }
    });
});
module.exports = router;
//# sourceMappingURL=Requests.js.map