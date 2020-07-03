import { Injectable } from '@angular/core';

import { Todo } from '../../../../domain';
import { StorageService } from './storage.service';
import { Observable, of } from 'rxjs';

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

    create(todo: string): Observable<Todo> {
        todo = todo.trim();
        if (todo.length === 0) {
            return;
        }

        const newTodo = new Todo(++this.lastInsertId, todo);
        this.todos.push(newTodo);
        this.save();

        return of(newTodo);
    }

    findAll(): Observable<Todo[]> {
        return of(this.todos);
    }

    update(todo: Todo): Observable<Todo> {
        todo.title = todo.title.trim();
        if (todo.title.length === 0) {
            this.delete(todo);
        }

        this.save();

        return of(todo);
    }

    delete(todo: Todo): Observable<Todo> {
        this.todos = this.todos.filter((t) => t !== todo);

        this.save();

        return of(null);
    }

    toggle(todo: Todo): Observable<Todo> {
        todo.completed = ! todo.completed;

        this.save();

        return of(todo);
    }

    toggleAll(completed: boolean): Observable<Todo[]> {
        this.todos.forEach((t) => t.completed = completed);

        this.save();

        return of(this.todos);
    }

    clearCompleted(): Observable<Todo[]> {
        this.todos = this.todos.filter((t) => !t.completed);

        this.save();

        return of(this.todos);
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
