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
        res.status(200).json({
            data: obj,
            message: 'ALL Personens loaded...'
        });
    });
});
router.get('/:PersonID', function (req, res, next) {
    var id = req.params.PersonID - 1;
    fs.readFile('./data/Personen.json', 'utf8', function (err, jsonString) {
        var obj = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: 'File not found!'
            });
            return;
        }
        if (obj[id] !== undefined) {
            res.status(200).json({
                data: obj[id],
                message: 'Spezial Person ' + req.params.PersonID
            });
        }
        else {
            res.status(200).json({
                message: 'Person ' + req.params.PersonID + ' not found!'
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
            message: 'ALL Personens loaded...'
        });
    });
});

 function GetPersonen(callback) {
    fetch('https://jsonplaceholder.typicode.com/users/')
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
                message: 'Spezial Person ' + id
            });
        } else {
            res.status(204).json({
                message: 'ID ' + id + ' not found!'
            });
        }
    });
});

function GetPersonByID(id, callback) {
    // fetch('./Personen.json')
    fetch('https://jsonplaceholder.typicode.com/users/' + id)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            callback(data)
        });
};

*/
// MUSS NOCH TERMIN GELÖSCHT WERDEN
router.delete('/:PersonID', function (req, res, next) {
    var id = req.params.PersonID;
    fs.readFile('./data/Personen.json', 'utf8', function (err, jsonStringPerson) {
        var objPerson = JSON.parse(jsonStringPerson);
        if (err) {
            res.status(404).json({
                message: 'File not found!'
            });
            return;
        }
        if (objPerson[id - 1] !== undefined) {
            fs.readFile('./data/Termine.json', 'utf8', function (err, jsonStringMeetings) {
                if (err) {
                    res.status(404).json({
                        message: 'File not found!'
                    });
                    return;
                }
                var objTermine = JSON.parse(jsonStringMeetings);
                // Filter deleted Person
                var newDataPerson = objPerson.filter(function (filtor) { return filtor.PERSONID !== objPerson[id - 1].PERSONID; });
                // Filter deleted Meetings
                var newDataMeetings = objTermine.filter(function (filtor) { return filtor.PERSONID !== objPerson[id - 1].PERSONID; });
                // Merge for output
                var newOutData = newDataPerson.concat(newDataMeetings);
                res.status(200).json({
                    data: newOutData,
                    message: 'Deleted Person ' + id + ' and all Meetings with Person ' + id
                });
            });
        }
        else {
            res.status(200).json({
                message: 'Person ' + id + ' not found!'
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
                message: 'File not found!'
            });
            return;
        }
        if (activeObj.PERSONID === 0) {
            // insert
            activeObj.PERSONID = obj.length + 1;
            var newData = obj.concat(activeObj);
            res.status(201).json({
                data: newData,
                message: 'Insert this Person'
            });
        }
        else {
            // update
            var IDValid = obj.filter(function (filtor) { return filtor.PERSONID === activeObj.PERSONID; });
            if (IDValid.length > 0) {
                var newData = obj.filter(function (filtor) { return filtor.PERSONID !== obj[activeObj.PERSONID - 1].PERSONID; }).concat(activeObj);
                res.status(201).json({
                    data: newData,
                    message: 'Update this Person'
                });
            }
            else {
                res.status(201).json({
                    message: 'Person ' + activeObj.PERSONID + ' not found'
                });
            }
        }
    });
});
module.exports = router;
//# sourceMappingURL=Persons.js.map