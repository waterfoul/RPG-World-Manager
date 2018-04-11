import { Repository, Signature } from 'nodegit';
import { ncp } from 'ncp';
import path from 'path';
import fs from 'promise-fs';
import promisify from 'promisify-node';
ncp = promisify(ncp);

const sig = Signature.now('RPG-World-Maker', 'invalid@email.ttt');

const dataDir = path.join(__dirname, '..', '..', 'repos');
const templateDir = path.join(__dirname, '..', 'template');
fs.stat(dataDir)
    .catch(() => {
        return fs.mkdir(dataDir);
    });

export function listRepos() {
    return fs.readdir(dataDir);
}

function getPath(name) {
    return path.join(path.join(dataDir, name));
}

export function createRepo(name) {
    const repoPath = getPath(name);
    return fs.mkdir(repoPath)
        .then(() => Repository.init(repoPath, 0))
        .then((repo) => ncp(templateDir, repoPath).then(() => repo))
        .then((repo) => repo.createCommitOnHead(
            ['map.json'],
            sig,
            sig,
            'Initial Commit'
        ).then((commit) => ({repo, commit})))
        .then(({ repo, commit }) => {console.log(commit); repo.createBranch('master', commit, true)});
}

export function getInfo(name) {
    const repoPath = getPath(name);
    return Repository.open(repoPath)
        .then((repo) => {
            return repo.getBranch('~~META~~');
        })
        .then((metaCommit) => {
            console.log(metaCommit);
        })
}