import path = require('path');
import { Argv } from '../Argv';
import { server } from '../../index';

export = {
    command: 'start',
    desc: 'Start the Serenity/JS playground',
    builder: {
        port: {
            default:   3000,
            describe: 'The port to start the web server on',
        },
        db: {
            default: path.join(process.cwd(), 'todos.json'),
            describe: 'Location of JSON file where the server will store its data'
        }
    },
    handler: (argv: Argv) => new Promise((resolve, reject) => {
        const instance = server(argv.db);

        instance.on('error', reject);
        instance.listen(parseInt(argv.port, 10), '127.0.0.1', () => {
            // tslint:disable-next-line:no-console
            console.log(`
    Serenity/JS Playground started!
    - User Interface - http://localhost:${ argv.port }

    API:
    - Health check   -    GET http://localhost:${ argv.port }/api/health
    - List items     -    GET http://localhost:${ argv.port }/api/todos
    - Add an item    -   POST http://localhost:${ argv.port }/api/todos { title: string, completed: boolean }
    - Update an item -    PUT http://localhost:${ argv.port }/api/todos { title: string, completed: boolean }
    - Remove an item - DELETE http://localhost:${ argv.port }/api/todos/:id
    - Remove all     - DELETE http://localhost:${ argv.port }/api/todos
            `);
        });
    }),
};
