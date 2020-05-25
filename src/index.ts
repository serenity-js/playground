import { api } from './api';
import express = require('express');
import { resolve } from 'path';

api.use(express.static(resolve(__dirname, './webapp')))

export const server: express.Express = api;
