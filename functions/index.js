const functions = require('firebase-functions');
const express = require('express');
const {addEntry} = require('./controller/addEntry');

const app = express();
app.get('/', (req, res) => res.status(200).send('Hey there!'));

app.post('/add-entry', addEntry);
exports.app = functions.https.onRequest(app);