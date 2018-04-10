import express from 'express';
import {repo} from './repo';

export const api = express();

api.use('/repo', repo);
