import {
    contain,
    containAtLeastOneItemThat,
    Ensure,
    equals,
    not,
    property,
} from '@serenity-js/assertions';
import { actorCalled, engage, Log } from '@serenity-js/core';
import { LocalServer, StartLocalServer, StopLocalServer } from '@serenity-js/local-server';
import { Browser } from '@serenity-js/protractor';
import { logging, protractor } from 'protractor';

import {
    Actors,
    FilterItems,
    RecordedItems,
    RecordItem,
    RemoveItem,
    RenameItem,
    Start,
    ToggleItem,
} from './screenplay';
import { GetRequest, LastResponse, Send } from '@serenity-js/rest';

describe('Playground Todo App', function() {

    this.timeout(30000);

    before(() => engage(new Actors(protractor.browser.baseUrl)));

    describe('actor', () => {

        beforeEach(() =>
            actorCalled('Adam').attemptsTo(
                StartLocalServer.onPort(3000),
                Log.the(LocalServer.url()),
                Ensure.that(LocalServer.url(), equals('http://127.0.0.1:3000')),

                Send.a(GetRequest.to('/api/health')),
                Ensure.that(LastResponse.status(), equals(200)),
            ));

        afterEach(() =>
            actorCalled('Adam').attemptsTo(
                StopLocalServer.ifRunning(),
            ));

        it('can record new items', () =>
            actorCalled('Jasmine').attemptsTo(
                Start.withAnEmptyList(),
                RecordItem.called('Walk a dog'),
                Ensure.that(RecordedItems(), contain('Walk a dog')),
            ));

        it('can remove the recorded items', () =>
            actorCalled('Jasmine').attemptsTo(
                Start.withAListContaining('Walk a dog'),
                RemoveItem.called('Walk a dog'),
                Ensure.that(RecordedItems(), property('length', equals(0))),
            ));

        it('can mark an item as completed', () =>
            actorCalled('Jasmine').attemptsTo(
                Start.withAListContaining('Buy a cake'),
                ToggleItem.called('Buy a cake'),
                FilterItems.toShow('Completed'),
                Ensure.that(RecordedItems(), contain('Buy a cake')),
            ));

        it('can edit an item', () =>
            actorCalled('Jasmine').attemptsTo(
                Start.withAListContaining('Buy a cake'),
                RenameItem.called('Buy a cake').to('Buy an apple'),
                Ensure.that(RecordedItems(), contain('Buy an apple')),
            ));

        it('can filter the list to show active items only', () =>
            actorCalled('Jasmine').attemptsTo(
                Start.withAListContaining(
                    'Play guitar',
                    'Read a book',
                    'Write some code',
                ),
                ToggleItem.called('Write some code'),
                FilterItems.toShow('Active'),
                Ensure.that(
                    RecordedItems(),
                    equals(['Play guitar', 'Read a book']),
                ),
            ));
    });

    afterEach(() =>
        actorCalled('Jasmine').attemptsTo(
            Ensure.that(Browser.log(), not(containAtLeastOneItemThat(property('level', equals(logging.Level.SEVERE)))))
        ));
});
