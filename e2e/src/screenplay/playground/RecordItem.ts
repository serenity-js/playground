import { contain } from '@serenity-js/assertions';
import { Task } from '@serenity-js/core';
import { Enter, Press, Wait } from '@serenity-js/protractor';
import { protractor } from 'protractor';
import { RecordedItems } from './RecordedItems';
import { TodoList } from './ui';

export class RecordItem {
    static called = (name: string) =>
        Task.where(`#actor records an item called "${ name }"`,
            Enter.theValue(name).into(TodoList.newTodoInput),
            Press.the(protractor.Key.ENTER).in(TodoList.newTodoInput),
            Wait.until(RecordedItems(), contain(name)),
        );
}
