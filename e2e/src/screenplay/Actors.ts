import { Actor, Cast, TakeNotes } from '@serenity-js/core';
import { ManageALocalServer } from '@serenity-js/local-server';
import { BrowseTheWeb } from '@serenity-js/protractor';

import { protractor } from 'protractor';

import { server } from '../../../src';
import { CallAnApi } from '@serenity-js/rest';

export class Actors implements Cast {
    prepare(actor: Actor): Actor {
        switch (actor.name) {
            case 'Adam':
                return actor.whoCan(
                    TakeNotes.usingASharedNotepad(),
                    BrowseTheWeb.using(protractor.browser),                 // todo: fixme, remove
                    ManageALocalServer.runningAHttpListener(server),        // todo: `server` should be parametrised
                    CallAnApi.at('http://localhost'),
                );
            case 'Jasmine':
            default:
                return actor.whoCan(
                    TakeNotes.usingASharedNotepad(),
                    CallAnApi.at(protractor.browser.baseUrl),
                    BrowseTheWeb.using(protractor.browser),
                );
        }
    }
}
