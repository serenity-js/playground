import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Todo } from '../../../../domain';
import { StorageService } from './storage.service';
import { map } from 'rxjs/operators';
import { Serialised } from 'tiny-types';

@Injectable()
export class RestStorageService extends StorageService {

    constructor(private readonly http: HttpClient) {
        super();
    }

    create(todo: string): Observable<Todo> {
        todo = todo.trim();
        if (todo.length === 0) {
            return;
        }

        const newTodo = new Todo(undefined, todo);

        return this.http.post(`${ environment.apiUrl }/todos`, newTodo.toJSON())
            .pipe(map(Todo.fromJSON));
    }

    findAll(): Observable<Todo[]> {
        return (this.http.get(`${ environment.apiUrl }/todos`) as Observable<Array<Serialised<Todo>>>)
            .pipe(map(items => items.map(Todo.fromJSON)));
    }

    update(todo: Todo): Observable<Todo> {
        todo.title = todo.title.trim();

        if (todo.title.length === 0) {
            return this.delete(todo);
        }

        return this.http.put(`${ environment.apiUrl }/todos/${ todo.id }`, todo.toJSON())
            .pipe(map(Todo.fromJSON));
    }

    delete(todo: Todo): Observable<Todo> {
        return this.http.delete(`${ environment.apiUrl }/todos/${ todo.id }`)
            .pipe(map(() => todo));
    }

    toggle(todo: Todo): Observable<Todo> {
        todo.completed = ! todo.completed;

        return this.http.put(`${ environment.apiUrl }/todos/${ todo.id }`, todo)
            .pipe(map(Todo.fromJSON));
    }

    toggleAll(completed: boolean): Observable<Todo[]> {
        return (this.http.patch(`${ environment.apiUrl }/todos`, { completed }) as Observable<Array<Serialised<Todo>>>)
            .pipe(map(items => items.map(Todo.fromJSON)));
    }

    clearCompleted(): Observable<Todo[]> {
        return (this.http.delete(`${ environment.apiUrl }/todos`, {
            params: { completed: 'true' }
        }) as unknown as Observable<Array<Serialised<Todo>>>)
            .pipe(map(items => items.map(Todo.fromJSON)));
    }
}
