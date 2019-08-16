import express = require('express');
import { IMeetings } from '../model/model';
import * as moment from 'moment';

// import fetch from 'node-fetch';  // testing with jsonplaceholder
const router = express.Router();

// for local FileSystem
const fs = require('fs')

router.get('/', (req: express.Request, res: express.Response, next) => {
    fs.readFile('./data/Termine.json', 'utf8', (err, jsonString) => {
        const obj: IMeetings[] = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: err
            });
            return
        }
        res.status(200).json({
            data: obj,
            message: 'ALL Meetings loaded...'
        });
    })
});

router.get('/:MeetingID', (req: express.Request, res: express.Response, next) => {
    const id: number = req.params.MeetingID - 1
    fs.readFile('./data/Termine.json', 'utf8', (err, jsonString) => {
        const obj: IMeetings[] = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: 'File not found!'
            });
            return
        }

        if (obj[id] !== undefined) {
            res.status(200).json({
                data: obj[id],
                message: 'Spezial Meeting ' + req.params.MeetingID
            });
        } else {
            res.status(200).json({
                message: 'Meeting ' + req.params.MeetingID + ' not found!'
            })
        };

    })
});

router.delete('/:MeetingID', (req: express.Request, res: express.Response, next) => {
    const id: number = req.params.MeetingID
    fs.readFile('./data/Termine.json', 'utf8', (err, jsonString) => {
        const obj: IMeetings[] = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: 'File not found!'
            });
            return
        }

        if (obj[id - 1] !== undefined) {
            const newData = obj.filter(
                filtor => filtor.MEETINGID !== obj[id - 1].MEETINGID)
            res.status(200).json({
                data: newData,
                message: 'Deleted Id ' + id
            });
        } else {
            res.status(200).json({
                message: 'Meeting ' + id + ' not found!'
            })
        }

    });
});

router.post('/', (req: express.Request, res: express.Response, next) => {
    fs.readFile('./data/Termine.json', 'utf8', (err, jsonString) => {
        // obj for update or Insert
        const activeObj: IMeetings = req.body
        const obj: IMeetings[] = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: 'File not found!'
            });
            return
        }
        if (activeObj.MEETINGID === 0) {
            // insert and check if valid
            let value: Boolean = validatenCheck(activeObj, obj)
            if (value) {
                activeObj.MEETINGID = obj.length + 1
                const newData = obj.concat(activeObj)
                res.status(201).json({
                    data: newData,
                    message: 'Insert this Meeting'
                });
            } else {
                res.status(200).json({
                    message: 'ERROR with Insert new Meeting'
                })
            }

        } else {
            // update
            const IDValid = obj.filter(
                filtor => filtor.MEETINGID === activeObj.MEETINGID)
            if (IDValid.length > 0) {
                // check if valid
                let value: Boolean = validatenCheck(activeObj, obj)
                if (value) {
                    const newData = obj.filter(
                        filtor => filtor.MEETINGID !== obj[activeObj.MEETINGID - 1].MEETINGID).concat(activeObj)
                    res.status(201).json({
                        data: newData,
                        message: 'Update this Meeting'
                    });
                } else {
                    res.status(200).json({
                        message: 'ERROR with Update new Meeting'
                    })
                }
            } else {
                res.status(201).json({
                    message: 'Meeting ' + activeObj.MEETINGID + ' not found'
                });

            }
        }
    });

});

function validatenCheck(activeObj, obj) {
    let uebergabe: boolean
    const ActiveMeetingsforPerson = obj.filter(
        filtor => filtor.PERSONID === activeObj.PERSONID)

    const NewMeetingStart = moment(activeObj.START)
    const NewMeetingEnd = moment(activeObj.ENDE)
    for (let i = 0; i <= ActiveMeetingsforPerson.length - 1; i++) {
        const ActiveMeetingStart = moment(ActiveMeetingsforPerson[i].START);
        const ActiveMeetingEnd = moment(ActiveMeetingsforPerson[i].ENDE);
        if (NewMeetingStart <= ActiveMeetingStart && NewMeetingStart <= ActiveMeetingEnd) {
            if (NewMeetingEnd <= ActiveMeetingEnd && NewMeetingEnd <= ActiveMeetingStart) {
                console.log("valid vor")
                uebergabe = true
            } else {
                console.log("error vor")
                uebergabe = false
                return false
            }
        } else if (NewMeetingStart >= ActiveMeetingStart && NewMeetingStart >= ActiveMeetingEnd) {
            if (NewMeetingEnd >= ActiveMeetingEnd && NewMeetingEnd >= ActiveMeetingStart) {
                console.log("valid nach")
                uebergabe = true
            } else {
                console.log("error nach")
                uebergabe = false
                return false
            }
        } else {
            console.log("error!")
            uebergabe = false
            return false
        }
    }
    return uebergabe

}

module.exports = router;