import { Serialised, TinyType } from 'tiny-types';

export class Todo extends TinyType {
    static fromJSON(o: Serialised<Todo>) {
        return new Todo(o['id'], o['title'], o['completed']);
    }

    constructor(
        public id: number,
        public title: string,
        public completed: boolean = false,
    ) {
        super();
    }

    clone(): Todo {
        return new Todo(this.id, this.title, this.completed);
    }
}
