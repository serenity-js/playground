import { equals } from '@serenity-js/assertions';
import { Pick, Target, Text } from '@serenity-js/protractor';
import { by, ElementArrayFinder, ElementFinder } from 'protractor';

export class TodoList {
    static newTodoInput = Target.the('"What needs to be done?" input box')
        .located(by.css('.new-todo'));

    static editTodoInput = Target.the('todo item edit box')
        .located(by.css('.todo-list li.editing .edit'));

    static items = Target.all('recorded items')
        .located(by.css('.todo-list li'));

    static itemCalled = (name: string) =>
        Pick.from<ElementFinder, ElementArrayFinder>(TodoList.items)
            .where(Text, equals(name)).first();

    static filterCalled = (name: string) =>
        Target.the(`${ name } filter`).located(by.linkText(name));
}
