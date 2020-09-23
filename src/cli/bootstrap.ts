const yargs = require('yargs');             // tslint:disable-line:no-var-requires
const pkg = require('../../package.json');  // tslint:disable-line:no-var-requires

/**
 * @desc
 *  Allows for the Serenity/JS Playground command line interface output to be intercepted for testing purposes.
 *
 * @typedef {function(error: Error, parsed: object, output: string): void} Interceptor
 *
 * @package
 */
export type Interceptor = (error: Error, parsed: { [key: string]: string | number }, output: string) => void;

/**
 * @desc
 *  Invokes the Serenity/JS Playground command line interface
 *
 * @param {string[]} argv
 * @param {Interceptor} interceptor
 *
 * @package
 */
export function bootstrap(argv: string[], interceptor?: Interceptor) {
    yargs()
        .version(require('../../package.json').version)
        .demand(1)
        .usage('Usage: $0 <command> [options]')
        .example('$0 start [options]', 'updates the Serenity jar to the latest version')
        .example('$0 <command> --help', 'shows the available parameters')
        .epilog(`copyright (C) 2016-${ new Date().getFullYear() } ${ pkg.author.name } <${ pkg.author.email }>`)
        .commandDir('./commands')
        .alias('h', 'help').help()
        .parse(argv, { }, interceptor);
}
