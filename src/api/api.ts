import express = require('express');

function errorHandler(err, req, res, next) {
    console.error(err.stack);   // tslint:disable-line:no-console
    next(err);
}

export const api = express()
    .use(errorHandler)
    .get('/api/health', (req: express.Request, res: express.Response) => {
        res.sendStatus(200);
    })
    .get('/api/config', (req: express.Request, res: express.Response) => {
        res.send({
            // storage: 'BrowserLocalStorage',
            storage: 'InMemoryStorageService',
        });
    })
;
