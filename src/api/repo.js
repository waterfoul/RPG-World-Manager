import express from 'express';
import {listRepos, createRepo, getInfo, setInfo} from "../repo-manager";

export const repo = express();

repo.post('/:name', (req, res) => {
    createRepo(req.params.name).then(() => res.send()).catch((e) => {
        console.error(e);
        res.status(500).send()
    });
});

repo.put('/:name', (req, res) => {
    setInfo(req.params.name, req.body)
        .then(() => res.send())
        .catch((e) => {
            console.error(e);
            res.status(500).send()
        });
});

repo.get('/:name', (req, res) => {
    getInfo(req.params.name)
        .then((value) => res.send(value))
        .catch((e) => {
            console.error(e);
            res.status(500).send()
        });
});

repo.get('/', (req, res) => {
    listRepos().then((repos) => {
        res.send(repos);
    }).catch((e) => {
        console.error(e);
        res.status(500).send()
    });
});