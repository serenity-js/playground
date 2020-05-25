import { ChangeDetectionStrategy, Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Todo } from '../../../domain';
import { Filter } from './filter.model';
import { StorageService } from './storage/storage.service';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent implements OnInit, DoCheck, OnDestroy {

    private routeSubscription: Subscription;

    newTodo = '';
    currentTodo: Todo;
    snapshot: Todo;

    filter = Filter.default();
    todos: Todo[];
    filteredTodos: Todo[];
    completed: number;
    remaining: number;
    allCompleted: boolean;

    constructor(
        private storageService: StorageService,
        private route: ActivatedRoute,
    ) {
    }

    // ~ lifecycle

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(params => {
            this.filter = Filter.fromString(params['filter']);
        });
    }

    ngDoCheck() {
        this.todos = this.storageService.findAll();
        this.filteredTodos = this.todos.filter(todo => this.filter.allows(todo));
        this.remaining = this.completed = 0;
        this.todos.forEach(t => t.completed ? this.completed++ : this.remaining++);
        this.allCompleted = this.todos.length === this.completed;
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
    }

    // ~ crud

    create(todo: string) {
        if (todo.trim().length === 0) {
            return;
        }
        this.storageService.create(todo);
        this.newTodo = '';
    }

    edit(todo: Todo) {
        this.currentTodo = todo;
        this.snapshot = todo.clone();
    }

    cancelEdit() {
        this.currentTodo = null;
        this.snapshot = null;
    }

    update(todo: Todo) {
        this.currentTodo = null;
        this.snapshot = null;
        this.storageService.update(todo);
    }

    delete(todo: Todo) {
        this.storageService.delete(todo);
    }

    toggle(todo: Todo) {
        this.storageService.toggle(todo);
    }

    toggleAll(completed: boolean) {
        this.storageService.toggleAll(completed);
    }

    clearCompleted() {
        this.storageService.clearCompleted();
    }
}
