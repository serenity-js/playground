import { Task } from '@serenity-js/core';
import { Click } from '@serenity-js/protractor';
import { TodoList } from './ui';

export class FilterItems {
    static toShow(state: string) {
        return Task.where(`#actor filters the list to show ${ state.toLowerCase() } items`,
            Click.on(TodoList.filterCalled(state)),
        );
    }
}
