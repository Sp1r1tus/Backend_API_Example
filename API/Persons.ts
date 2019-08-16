import express = require('express');
import { IPerson, IMeetings } from '../model/model';
// import fetch from 'node-fetch';  // testing with jsonplaceholder
const router = express.Router();

// for local FileSystem
const fs = require('fs')

router.get('/', (req: express.Request, res: express.Response, next) => {
    fs.readFile('./data/Personen.json', 'utf8', (err, jsonString) => {
        const obj: IPerson[] = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: err
            });
            return
        }
        res.status(200).json({
            data: obj,
            message: 'ALL Personens loaded...'
        });
    })
});

router.get('/:PersonID', (req: express.Request, res: express.Response, next) => {
    const id: number = req.params.PersonID - 1
    fs.readFile('./data/Personen.json', 'utf8', (err, jsonString) => {
        const obj: IPerson[] = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: 'File not found!'
            });
            return
        }

        if (obj[id] !== undefined) {
            res.status(200).json({
                data: obj[id],
                message: 'Spezial Person ' + req.params.PersonID
            });
        } else {
            res.status(200).json({
                message: 'Person ' + req.params.PersonID + ' not found!'
            })
        };

    })
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
router.delete('/:PersonID', (req: express.Request, res: express.Response, next) => {
    const id: number = req.params.PersonID
    fs.readFile('./data/Personen.json', 'utf8', (err, jsonStringPerson) => {
        const objPerson: IPerson[] = JSON.parse(jsonStringPerson);
        if (err) {
            res.status(404).json({
                message: 'File not found!'
            });
            return
        }
        if (objPerson[id - 1] !== undefined) {
            fs.readFile('./data/Termine.json', 'utf8', (err, jsonStringMeetings) => {
                if (err) {
                    res.status(404).json({
                        message: 'File not found!'
                    });
                    return
                }
                const objTermine: IMeetings[] = JSON.parse(jsonStringMeetings);

                // Filter deleted Person
                const newDataPerson = objPerson.filter(
                    filtor => filtor.PERSONID !== objPerson[id - 1].PERSONID)

                // Filter deleted Meetings
                const newDataMeetings = objTermine.filter(
                    filtor => filtor.PERSONID !== objPerson[id - 1].PERSONID)

                // Merge for output
                const newOutData = [...newDataPerson, ...newDataMeetings] 

                res.status(200).json({
                    data: newOutData,
                    message: 'Deleted Person ' + id + ' and all Meetings with Person ' + id
                });
            });
        } else {
            res.status(200).json({
                message: 'Person ' + id + ' not found!'
            })
        }

    });
});

router.post('/', (req: express.Request, res: express.Response, next) => {
    fs.readFile('./data/Personen.json', 'utf8', (err, jsonString) => {
        // obj for update or Insert
        const activeObj: IPerson = req.body
        const obj: IPerson[] = JSON.parse(jsonString);
        if (err) {
            res.status(404).json({
                message: 'File not found!'
            });
            return
        }
        if (activeObj.PERSONID === 0) {
            // insert
            activeObj.PERSONID = obj.length + 1
            const newData = obj.concat(activeObj)
            res.status(201).json({
                data: newData,
                message: 'Insert this Person'
            });
        } else {
            // update
            const IDValid = obj.filter(
                filtor => filtor.PERSONID === activeObj.PERSONID)
            if (IDValid.length > 0) {
                const newData = obj.filter(
                    filtor => filtor.PERSONID !== obj[activeObj.PERSONID - 1].PERSONID).concat(activeObj)
                res.status(201).json({
                    data: newData,
                    message: 'Update this Person'
                });
            } else {
                res.status(201).json({
                    message: 'Person ' + activeObj.PERSONID + ' not found'
                });

            }
        }
    });

});

module.exports = router;