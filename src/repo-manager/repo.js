import { Repository, Signature, Commit } from 'nodegit';
import { ncp as ncp_orig } from 'ncp';
import path from 'path';
import fs from 'promise-fs';
import {getPath, sig, dataDir} from './utils';
import promisify from 'promisify-node';

const ncp = promisify(ncp_orig);
const templateDir = path.join(__dirname, '..', 'template');

export function listRepos() {
    return fs.readdir(dataDir);
}

export function createRepo(name) {
    const repoPath = getPath(name);
    return fs.mkdir(repoPath)
        .then(() => Repository.init(repoPath, 0))
        .then((repo) => ncp(templateDir, repoPath).then(() => repo))
        .then((repo) => repo.createCommitOnHead(
            // TODO: Include all files
            ['map.json'],
            sig,
            sig,
            'Initial Commit'
        ).then((commit) => ({repo, commit})))
        .then(({ repo, commit }) => {console.log(commit); repo.createBranch('master', commit, true)});
}
