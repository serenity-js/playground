import { Actor, Cast, TakeNotes } from '@serenity-js/core';
import { ManageALocalServer } from '@serenity-js/local-server';
import { BrowseTheWeb } from '@serenity-js/protractor';

import path = require('path');
import { protractor } from 'protractor';

import { server } from '../../../src';
import { CallAnApi } from '@serenity-js/rest';

export class Actors implements Cast {
    constructor(private readonly baseUrl: string) {
    }

    prepare(actor: Actor): Actor {
        switch (actor.name) {
            case 'Adam':
                return actor.whoCan(
                    TakeNotes.usingASharedNotepad(),
                    BrowseTheWeb.using(protractor.browser),                 // todo: fixme, remove
                    ManageALocalServer.runningAHttpListener(server(
                        path.join(__dirname, '../../../target/todos.json')
                    )),
                    CallAnApi.at(this.baseUrl),
                );
            case 'Jasmine':
            default:
                return actor.whoCan(
                    TakeNotes.usingASharedNotepad(),
                    CallAnApi.at(this.baseUrl),
                    BrowseTheWeb.using(protractor.browser),
                );
        }
    }
}
