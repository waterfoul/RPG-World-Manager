import express from 'express';
import {listRepos, createRepo} from "../repo-manager";

export const repo = express();

repo.post('/:name', (req, res) => {
    createRepo(req.params.name).then(() => res.send()).catch((e) => {
        console.error(e);
        res.status(500).send()
    });
});

repo.get('/:name', (req, res) => {
    res.send(req.params);
});

repo.get('/', (req, res) => {
    listRepos().then((repos) => {
        res.send(repos);
    }).catch((e) => {
        console.error(e);
        res.status(500).send()
    });
});