import path = require('path');
import { api } from './api';

const port = 3000;
// tslint:disable-next-line:no-console
api(path.join(__dirname, '../target/todos.json'))
    .listen(port, () => console.log(`Serenity/JS Playground API started on http://localhost:${port}`));
