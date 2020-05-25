import { Argv } from '../Argv';
import { server } from '../../index';

export = {
    command: 'start',
    desc: 'Makes sure the Serenity BDD CLI jar file is available and up to date',
    builder: {
        port: {
            default:   3000,
            describe: 'The port to start the web server on',
        },
    },
    handler: (argv: Argv) => new Promise((resolve, reject) => {
        server.on('error', reject);
        server.listen(parseInt(argv.port, 10), '127.0.0.1', () => {
            // tslint:disable-next-line:no-console
            console.log(`Serenity/JS Playground started on http://localhost:${ argv.port }`)
        });
    }),
};
