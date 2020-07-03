import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Todo } from '../../../../domain';
import { StorageService } from './storage.service';

@Injectable()
export class InMemoryStorageService extends StorageService {

    private lastInsertId = 0;
    private todos: Todo[] = [];

    constructor() {
        super();
    }

    create(todo: string): Observable<Todo> {
        todo = todo.trim();
        if (todo.length === 0) {
            return;
        }

        const newTodo = new Todo(++this.lastInsertId, todo);
        this.todos.push(newTodo);

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

        return of(todo);
    }

    delete(todo: Todo): Observable<Todo> {
        this.todos = this.todos.filter((t) => t !== todo);

        return of(null);
    }

    toggle(todo: Todo): Observable<Todo> {
        todo.completed = ! todo.completed;

        return of(todo);
    }

    toggleAll(completed: boolean): Observable<Todo[]> {
        this.todos.forEach((t) => t.completed = completed);

        return of(this.todos);
    }

    clearCompleted(): Observable<Todo[]> {
        this.todos = this.todos.filter((t) => !t.completed);

        return of(this.todos);
    }
}
