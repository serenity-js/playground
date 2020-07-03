import bodyParser = require('body-parser');
import express = require('express');
import fs = require('fs');
import path = require('path');
import FileSync = require('lowdb/adapters/FileSync');
import { nanoid } from 'nanoid';
import { Todo } from '../domain';
const lowDB = require('lowdb');

function errorHandler(err, req, res, next) {
    console.error(err.stack);   // tslint:disable-line:no-console
    next(err);
}

export function api (pathToDbJson: string) {

    fs.mkdirSync(path.dirname(pathToDbJson), { recursive: true });

    const db = lowDB(new FileSync(pathToDbJson));

    db.defaults({
        todos: [],
    }).write();

    return express()
        .use(errorHandler)
        .use(bodyParser.json())
        .get('/api/health', (req: express.Request, res: express.Response) => {
            res.status(200).send({
                uptime: Math.floor(process.uptime()),
            });
        })
        .get('/api/config', (req: express.Request, res: express.Response) => {
            res.send({
                storage: 'RestStorageService',
                // storage: 'LocalStorageService',
                // storage: 'InMemoryStorageService',
            });
        })

        // get all items
        .get('/api/todos', (req: express.Request, res: express.Response) => {
            res.json(db.get('todos').value());
        })
        // create an item
        .post('/api/todos', (req: express.Request, res: express.Response) => {
            const serialised = Todo.fromJSON({ ...req.body, id: nanoid() }).toJSON();

            db.get('todos')
                .push(serialised)
                .write();

            res.json(serialised);
        })
        // change status of all todos
        .patch('/api/todos', (req: express.Request, res: express.Response) => {

            db.get('todos')
                .each(item => {
                    item.completed = req.body.completed
                })
                .write();

            res.json(db.get('todos').value());
        })
        // remove all todos
        .delete('/api/todos/', (req: express.Request, res: express.Response) => {

            function filter() {
                switch (req.query.completed) {
                    case 'true':
                        return { completed: true };
                    case 'false':
                        return { completed: false };
                    default:
                        return undefined;
                }
            }

            db.get('todos')
                .remove(filter())
                .write();

            res.json(db.get('todos').value());
        })
        // update an item
        .put('/api/todos/:id', (req: express.Request, res: express.Response) => {

            const serialised = Todo.fromJSON(req.body).toJSON();

            db.get('todos')
                .find({ id: req.params.id })
                .assign(serialised)
                .write();

            res.json(serialised);
        })
        // remove an item
        .delete('/api/todos/:id', (req: express.Request, res: express.Response) => {

            db.get('todos')
                .remove({ id: req.params.id })
                .write();

            res.status(200).send();
        })
    ;
}
