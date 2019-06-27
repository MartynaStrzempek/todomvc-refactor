import {Filter, Todo} from "../types/types";

export class TodoModel {
    private todos: Todo[] = [];

    getTodos(): Todo[] {
        return this.todos;
    }

    setTodos(todos: Todo[]): void{
        this.todos = todos;
    }

    getActiveTodos(): Todo[] {
        return this.todos.filter(function (todo) {
            return !todo.completed;
        });
    }
    getCompletedTodos(): Todo[] {
        return this.todos.filter(function (todo) {
            return todo.completed;
        });
    }
    getFilteredTodos(filter: Filter): Todo[] {
        if (filter === 'active') {
            return this.getActiveTodos();
        }

        if (filter === 'completed') {
            return this.getCompletedTodos();
        }

        return this.todos;
    }
}