import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import { api } from './api';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/api', api);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));