import express = require('express');

function errorHandler(err, req, res, next) {
    console.error(err.stack);   // tslint:disable-line:no-console
    next(err);
}

export const api = express()
    .use(errorHandler)
    .get('/api/health', (req: express.Request, res: express.Response) => {
        res.status(200).send({
            uptime: Math.floor(process.uptime()),
        });
    })
    .get('/api/config', (req: express.Request, res: express.Response) => {
        res.send({
            // storage: 'LocalStorageService',
            storage: 'InMemoryStorageService',
        });
    })
;
