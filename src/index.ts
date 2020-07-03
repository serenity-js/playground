import { api } from './api';
import express = require('express');
import { resolve } from 'path';

export function server(pathToDbJson: string): express.Express {
    return api(pathToDbJson)
        .use(express.static(resolve(__dirname, './webapp')));
}
