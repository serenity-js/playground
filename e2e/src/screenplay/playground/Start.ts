import { Ensure, equals } from '@serenity-js/assertions';
import { Task } from '@serenity-js/core';
import { Navigate, Website } from '@serenity-js/protractor';
import { RecordItem } from './RecordItem';
import { GetRequest, LastResponse, Send } from '@serenity-js/rest';

export class Start {
    static withAnEmptyList = () =>
        Task.where(`#actor starts with an empty list`,
            CheckIfTheServerIsUp(),
            Navigate.to('/'),
            Ensure.that(Website.title(), equals('Serenity/JS Playground')),
        );

    static withAListContaining = (...items: string[]) =>
        Task.where(`#actor starts with a list containing ${ items.length } items`,
            Start.withAnEmptyList(),
            ...items.map(RecordItem.called),
        );
}

const CheckIfTheServerIsUp = () =>
    Task.where(`#actor checks if the server is up`,
        Send.a(GetRequest.to('/api/health/')),
        Ensure.that(LastResponse.status(), equals(200)),
    );
