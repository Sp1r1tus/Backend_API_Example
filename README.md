# Aufgabe
install node.js
download zip from github & unpack
open cmd & goto folder Aufgabe
write in cmd "npm install"
start programm with npm start


Programm is in Testmode with nodemon.
So all Requests should display in nodemon
Programm is written in Typescript. So nodemon take the compiled js Files from "Build" Folder (see in package.json)
- validation Check if person exists
- validation check if person is in another meeting

----------------------------------------------------
----------------------------------------------------
----------------------------------------------------
Test the API Person in Postman with following url:
----------------------------------------------------
----------------------------------------------------
----------------------------------------------------
"get" with localhost:4000/Persons/
----------------------------------------------------
"get" with localhost:4000/Persons/[PERSONID]
----------------------------------------------------
"delete" with localhost:4000/Persons/[PERSONID]
----------------------------------------------------
insert with PERSONID 0
"post" with localhost:4000/Persons/
Body: {
     "PERSONID": 0,
     "NAME": "zzzz",
     "ADRESSE": "zzzzz" ,
     "PLZ": "zzzzzz" ,
     "ORT": "zzzzzzz" 
}
----------------------------------------------------
update with PERSONID 1,2,3
"post" with localhost:4000/Persons/
Body: {
     "PERSONID": 1,
     "NAME": "zzzz",
     "ADRESSE": "zzzzz" ,
     "PLZ": "zzzzzz" ,
     "ORT": "zzzzzzz" 
}
----------------------------------------------------
----------------------------------------------------
----------------------------------------------------
Test the API Meetings in Postman with following url:
----------------------------------------------------
----------------------------------------------------
----------------------------------------------------
"get" with localhost:4000/Meetings/
----------------------------------------------------
"get" with localhost:4000/Meetings/[MEETINGID]
----------------------------------------------------
"delete" with localhost:4000/Meetings/[MEETINGID]
----------------------------------------------------
insert with MEETINGID 0
"post" with localhost:4000/Meetings/
Body: {
 "MEETINGID": 0,
 "NAME": "TERMIN 1",
 "PERSONID": 1,
 "START": "12:00",
 "ENDE": "12:30"
}
----------------------------------------------------
update with MEETINGID 1,2,3
"post" with localhost:4000/Meetings/
Body: {
 "MEETINGID": [MEETINGID],
 "NAME": "TERMIN 1",
 "PERSONID": 1,
 "START": "2019-08-16 12:00:00.000",
 "ENDE": "2019-08-16 12:30:00.000"
}
----------------------------------------------------