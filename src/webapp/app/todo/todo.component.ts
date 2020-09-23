import { ChangeDetectionStrategy, Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Todo } from '../../../domain';
import { Filter } from './filter.model';
import { StorageService } from './storage/storage.service';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent implements OnInit, DoCheck, OnDestroy {

    private routeSubscription: Subscription;

    newTodo = '';
    currentTodo: Todo;
    snapshot: Todo;

    filter = Filter.default();
    todos: Todo[] = [];

    constructor(
        private storageService: StorageService,
        private route: ActivatedRoute,
    ) {
    }

    get filteredTodos(): Todo[] {
        return this.todos.filter(todo => this.filter.allows(todo))
    }

    get remaining(): number {
        return this.todos
            .filter(t => ! t.completed)
            .length;
    }

    get completed(): number {
        return this.todos
            .filter(t => t.completed)
            .length;
    }

    get allCompleted(): boolean {
        return this.todos.length === this.completed;
    }

    // ~ lifecycle

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(params => {
            this.filter = Filter.fromString(params['filter']);
        });

        this.storageService.findAll()
            .subscribe(todos => {
                this.todos = todos;
            });
    }

    ngDoCheck() {
        // this.storageService.findAll()
        //     .subscribe(todos => {
        //         this.todos = todos;
        //         this.filteredTodos = this.todos.filter(todo => this.filter.allows(todo));
        //         this.remaining = this.completed = 0;
        //         this.todos.forEach(t => t.completed ? this.completed++ : this.remaining++);
        //         this.allCompleted = this.todos.length === this.completed;
        //     });
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
    }

    // ~ crud

    create(todo: string) {
        console.log('Component::create todo', todo)
        if (todo.trim().length === 0) {
            return;
        }
        this.storageService.create(todo).subscribe(newTodo => {
            console.log('Component::create todo', newTodo)
            this.todos = this.todos.concat(newTodo);
            this.newTodo = '';
        });
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
        this.storageService.update(todo).subscribe(updatedTodo => {
            this.todos = this.todos.map(item => item.id === updatedTodo.id ? updatedTodo : item);
        });
    }

    delete(todo: Todo) {
        this.storageService.delete(todo).subscribe(() => {
            this.todos = this.todos.filter(item => item.id !== todo.id);
        });
    }

    toggle(todo: Todo) {
        this.storageService.toggle(todo).subscribe(toggled => {
            this.todos.map(item => item.id === toggled.id ? toggled : item)
        });
    }

    toggleAll(completed: boolean) {
        this.storageService.toggleAll(completed).subscribe(todos => {
            this.todos = todos;
        });
    }

    clearCompleted() {
        this.storageService.clearCompleted().subscribe(todos => {
            this.todos = todos;
        });
    }
}
