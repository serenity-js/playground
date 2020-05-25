import { Injectable } from '@angular/core';

import { Todo } from '../../../../domain';

@Injectable()
export abstract class StorageService {

    abstract create(todo: string): Todo;

    abstract findAll(): Todo[];

    abstract update(todo: Todo): void;

    abstract delete(todo: Todo): void;

    abstract toggle(todo: Todo): void;

    abstract toggleAll(completed: boolean): void;

    abstract clearCompleted(): void;

    abstract remaining(): number;

    abstract completed(): number;
}
