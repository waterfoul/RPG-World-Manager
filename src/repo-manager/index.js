import { Repository, Signature } from 'nodegit';
import path from 'path';
import fs from 'promise-fs';

const sig = Signature.now('RPG-World-Maker', 'invalid@email.ttt');

const dataDir = path.join(__dirname, '..', '..', 'repos');
fs.stat(dataDir)
    .catch(() => {
        return fs.mkdir(dataDir);
    });

export function listRepos() {
    return fs.readdir(dataDir);
}

export function createRepo(name) {
    const repoPath = path.join(path.join(dataDir, name));
    return fs.mkdir(repoPath)
        .then(() => Repository.init(repoPath, 0))
        .then((repo) => /* TODO: copy the template */ fs.writeFile(path.join(repoPath, 'map.json'), '{}').then(() => repo))
        .then((repo) => repo.createCommitOnHead(
            ['map.json'],
            sig,
            sig,
            'Initial Commit'
        ).then((commit) => ({repo, commit})))
        .then(({ repo, commit }) => {console.log(commit); repo.createBranch('master', commit, true)});
}