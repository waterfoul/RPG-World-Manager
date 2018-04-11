import {Repository} from "nodegit";
import {getPath, sig, createNewHead} from './utils';
import path from 'path';
import fs from 'promise-fs';

const metaBranch = 'REPOMETA/INFO';

export function getInfo(name) {
    const repoPath = getPath(name);
    const infoFile = path.join(repoPath, 'info.json');

    return switchToMeta(
        () => (
            fs.readFile(infoFile)
                .catch(() => '{}')
                .then(JSON.parse)
        ),
        name
    );
}

export function setInfo(name, data) {
    const repoPath = getPath(name);
    const infoFile = path.join(repoPath, 'info.json');

    return switchToMeta(
        (repo) => (
            fs.writeFile(infoFile, JSON.stringify(data))
                .then(() => repo.createCommitOnHead(
                    ['info.json'],
                    sig,
                    sig,
                    'Info File Update'
                ))
                .then(() => {})
        ),
        name
    );
}

function switchToMeta(cb, name) {
    const repoPath = getPath(name);
    return Repository.open(repoPath)
        .then((repo) => {
            return repo.getCurrentBranch().then((currentBranch) => ({repo, currentBranch}));
        })
        .then(({repo, currentBranch}) => {
            return repo.checkoutBranch(metaBranch)
                .catch(() => {
                    return createNewHead(repo, metaBranch)
                        .then(() => repo.checkoutBranch(metaBranch))
                })
                .then(() => ({ repo, currentBranch }));
        })
        .then(({repo, currentBranch}) => cb(repo).then((data) => ({repo, currentBranch, data})))
        .then(({repo, currentBranch, data}) => repo.checkoutBranch(currentBranch).then(() => data));
}