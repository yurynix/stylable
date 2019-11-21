const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const dbFile = './playground-db.json';

const db = JSON.parse(fs.readFileSync(dbFile));

app.get('/cases/:id', (req, res) => {
    if (db.cases && db.cases.hasOwnProperty(req.params.id)) {
        res.json(db.cases[req.params.id]);
    } else {
        res.status(404);
        res.json({ error: 'could not find case' });
    }
});

app.post('/cases/:id', (req, res) => {
    console.log('req', req);
    try {
        db.cases = db.cases || {};
        db.cases[req.params.id] = req.body;
        fs.writeFileSync(dbFile, JSON.stringify(db));
        res.status(202);
        res.json({ status: 'ok' });
    } catch {
        res.status(500);
        res.json({ error: 'could not save case' });
    }
});

app.listen(port, () => console.log('dev server running on port ' + port));
