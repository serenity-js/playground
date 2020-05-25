import { Injectable } from '@angular/core';

import { Todo } from '../../../../domain';
import { StorageService } from './storage.service';

@Injectable()
export class InMemoryStorageService extends StorageService {

    private lastInsertId = 0;
    private todos: Todo[] = [];

    constructor() {
        super();
    }

    create(todo: string): Todo {
        todo = todo.trim();
        if (todo.length === 0) {
            return;
        }

        const newTodo = new Todo(++this.lastInsertId, todo);
        this.todos.push(newTodo);

        return newTodo;
    }

    findAll(): Todo[] {
        return this.todos;
    }

    update(todo: Todo): void {
        todo.title = todo.title.trim();
        if (todo.title.length === 0) {
            this.delete(todo);
        }
    }

    delete(todo: Todo): void {
        this.todos = this.todos.filter((t) => t !== todo);
    }

    toggle(todo: Todo): void {
        todo.completed = ! todo.completed;
    }

    toggleAll(completed: boolean): void {
        this.todos.forEach((t) => t.completed = completed);
    }

    clearCompleted(): void {
        this.todos = this.todos.filter((t) => !t.completed);
    }

    remaining(): number {
        return this.todos
            .filter(t => !t.completed)
            .length;
    }

    completed(): number {
        return this.todos
            .filter(t => t.completed)
            .length;
    }
}
