import { Injectable } from '@angular/core';

import { Todo } from '../../../../domain';
import { StorageService } from './storage.service';

@Injectable()
export class LocalStorageService extends StorageService {

    private static STORAGE_KEY = 'serenity-js-playground';
    private lastInsertId = 0;
    private todos: Todo[] = [];

    constructor() {
        super();

        this.todos = this.loadTodos();

        if (this.todos.length > 0) {
            this.lastInsertId = this.todos[this.todos.length - 1].id;
        }
    }

    create(todo: string): Todo {
        todo = todo.trim();
        if (todo.length === 0) {
            return;
        }

        const newTodo = new Todo(++this.lastInsertId, todo);
        this.todos.push(newTodo);
        this.save();

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
        this.save();
    }

    delete(todo: Todo): void {
        this.todos = this.todos.filter((t) => t !== todo);
        this.save();
    }

    toggle(todo: Todo): void {
        todo.completed = ! todo.completed;
        this.save();
    }

    toggleAll(completed: boolean): void {
        this.todos.forEach((t) => t.completed = completed);
        this.save();
    }

    clearCompleted(): void {
        this.todos = this.todos.filter((t) => !t.completed);
        this.save();
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

    private loadTodos(): Todo[] {
        try {
            const serialised = localStorage.getItem(LocalStorageService.STORAGE_KEY) || '[]';

            return JSON.parse(serialised).map(Todo.fromJSON);
        } catch (ignore) {
            return [];
        }
    }

    private save(): void {
        localStorage.setItem(LocalStorageService.STORAGE_KEY, JSON.stringify(this.todos));
    }
}
