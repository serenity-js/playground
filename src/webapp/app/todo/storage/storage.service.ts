import { Injectable } from '@angular/core';

import { Todo } from '../../../../domain';
import { Observable } from 'rxjs';

@Injectable()
export abstract class StorageService {

    abstract create(todo: string): Observable<Todo>;

    abstract findAll(): Observable<Todo[]>;

    abstract update(todo: Todo): Observable<Todo>;

    abstract delete(todo: Todo): Observable<Todo>;

    abstract toggle(todo: Todo): Observable<Todo>;

    abstract toggleAll(completed: boolean): Observable<Todo[]>;

    abstract clearCompleted(): Observable<Todo[]>;
}
