import { Todo } from '../../../domain';

export abstract class Filter {
    static fromString(name: string): Filter {
        switch (name) {
            case 'active':
                return new ActiveItems();
            case 'completed':
                return new CompletedItems();
            case 'all':
            default:
                return Filter.default();
        }
    }

    static default(): Filter {
        return new AllItems();
    }

    constructor(public readonly name: string) {
    }


    abstract allows(todo: Todo): boolean;
}

class AllItems extends Filter {

    constructor() {
        super('all');
    }

    allows(todo: Todo): boolean {
        return true;
    }
}

class ActiveItems extends Filter {

    constructor() {
        super('active');
    }

    allows(todo: Todo): boolean {
        return ! todo.completed;
    }
}

class CompletedItems extends Filter {

    constructor() {
        super('completed');
    }

    allows(todo: Todo): boolean {
        return todo.completed;
    }
}

// export enum Filter {
//     ALL = 'SHOW_ALL',
//     ACTIVE = 'SHOW_ACTIVE',
//     COMPLETED = 'SHOW_COMPLETED',
// }
//
// export class FilterUtil {
//     static fromString(filter: string): Filter {
//         switch (filter) {
//             case 'completed':
//                 return Filter.COMPLETED;
//             case 'active':
//                 return Filter.ACTIVE;
//             case 'all':
//             default:
//                 return Filter.ALL;
//         }
//     }
//
//     static accepts(todo: Todo, filter?: Filter): boolean {
//         switch (filter) {
//             case Filter.ACTIVE:
//                 return !todo.completed;
//             case Filter.COMPLETED:
//                 return todo.completed;
//             case Filter.ALL:
//             default:
//                 return true;
//         }
//     }
// }
