import {Commit, Signature} from "nodegit";
import path from 'path';
import fs from 'promise-fs';

export const dataDir = path.join(__dirname, '..', '..', 'repos');
export const sig = Signature.now('RPG-World-Maker', 'invalid@email.ttt');

fs.stat(dataDir)
    .catch(() => {
        return fs.mkdir(dataDir);
    });

export function getPath(name) {
    return path.join(path.join(dataDir, name));
}

export function createNewHead(repo, message, branchName) {
    repo.getMasterCommit()
        .then((commit) => commit.treeId())
        .then((treeOid) => repo.createCommit(
            'ORPHANCOMMIT',
            sig,
            sig,
            `Creating ${branchName}`,
            treeOid
        ))
        .then((oid) => repo.index()
            .then((index) => index.removeAll()
                .then(() => Promise.all([
                    index.writeTree().then((oid) => repo.getTree(oid)),
                    Commit.lookup(repo, oid)
                ]))
            )
        )
        .then(([ tree, commit ]) => commit.amend(
            null,
            null,
            null,
            null,
            null,
            tree
        ))
        .then((oid) => repo.createBranch(branchName, oid))
}