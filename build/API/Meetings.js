"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var moment = require("moment");
// import fetch from 'node-fetch';  // testing with jsonplaceholder
var router = express.Router();
// for local FileSystem
var fs = require('fs');
router.get('/', function (req, res, next) {
    fs.readFile('./data/Termine.json', 'utf8', function (err, jsonString) {
        var obj = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: err
            });
            return;
        }
        res.status(200).json({
            data: obj,
            message: 'ALL Meetings loaded...'
        });
    });
});
router.get('/:MeetingID', function (req, res, next) {
    var id = req.params.MeetingID - 1;
    fs.readFile('./data/Termine.json', 'utf8', function (err, jsonString) {
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
                message: 'Spezial Meeting ' + req.params.MeetingID
            });
        }
        else {
            res.status(200).json({
                message: 'Meeting ' + req.params.MeetingID + ' not found!'
            });
        }
        ;
    });
});
router.delete('/:MeetingID', function (req, res, next) {
    var id = req.params.MeetingID;
    fs.readFile('./data/Termine.json', 'utf8', function (err, jsonString) {
        var obj = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: 'File not found!'
            });
            return;
        }
        if (obj[id - 1] !== undefined) {
            var newData = obj.filter(function (filtor) { return filtor.MEETINGID !== obj[id - 1].MEETINGID; });
            res.status(200).json({
                data: newData,
                message: 'Deleted Id ' + id
            });
        }
        else {
            res.status(200).json({
                message: 'Meeting ' + id + ' not found!'
            });
        }
    });
});
router.post('/', function (req, res, next) {
    fs.readFile('./data/Termine.json', 'utf8', function (err, jsonString) {
        // obj for update or Insert
        var activeObj = req.body;
        var obj = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: 'File not found!'
            });
            return;
        }
        if (activeObj.MEETINGID === 0) {
            // insert and check if valid
            var value = validatenCheck(activeObj, obj);
            if (value) {
                activeObj.MEETINGID = obj.length + 1;
                var newData = obj.concat(activeObj);
                res.status(201).json({
                    data: newData,
                    message: 'Insert this Meeting'
                });
            }
            else {
                res.status(200).json({
                    message: 'ERROR with Insert new Meeting'
                });
            }
        }
        else {
            // update
            var IDValid = obj.filter(function (filtor) { return filtor.MEETINGID === activeObj.MEETINGID; });
            if (IDValid.length > 0) {
                // check if valid
                var value = validatenCheck(activeObj, obj);
                if (value) {
                    var newData = obj.filter(function (filtor) { return filtor.MEETINGID !== obj[activeObj.MEETINGID - 1].MEETINGID; }).concat(activeObj);
                    res.status(201).json({
                        data: newData,
                        message: 'Update this Meeting'
                    });
                }
                else {
                    res.status(200).json({
                        message: 'ERROR with Update new Meeting'
                    });
                }
            }
            else {
                res.status(201).json({
                    message: 'Meeting ' + activeObj.MEETINGID + ' not found'
                });
            }
        }
    });
});
function validatenCheck(activeObj, obj) {
    var uebergabe;
    var ActiveMeetingsforPerson = obj.filter(function (filtor) { return filtor.PERSONID === activeObj.PERSONID; });
    var NewMeetingStart = moment(activeObj.START);
    var NewMeetingEnd = moment(activeObj.ENDE);
    for (var i = 0; i <= ActiveMeetingsforPerson.length - 1; i++) {
        var ActiveMeetingStart = moment(ActiveMeetingsforPerson[i].START);
        var ActiveMeetingEnd = moment(ActiveMeetingsforPerson[i].ENDE);
        if (NewMeetingStart <= ActiveMeetingStart && NewMeetingStart <= ActiveMeetingEnd) {
            if (NewMeetingEnd <= ActiveMeetingEnd && NewMeetingEnd <= ActiveMeetingStart) {
                console.log("valid vor");
                uebergabe = true;
            }
            else {
                console.log("error vor");
                uebergabe = false;
                return false;
            }
        }
        else if (NewMeetingStart >= ActiveMeetingStart && NewMeetingStart >= ActiveMeetingEnd) {
            if (NewMeetingEnd >= ActiveMeetingEnd && NewMeetingEnd >= ActiveMeetingStart) {
                console.log("valid nach");
                uebergabe = true;
            }
            else {
                console.log("error nach");
                uebergabe = false;
                return false;
            }
        }
        else {
            console.log("error!");
            uebergabe = false;
            return false;
        }
    }
    return uebergabe;
}
module.exports = router;
//# sourceMappingURL=Meetings.js.map