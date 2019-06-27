import {Filter, Todo} from "../types/types";

export class TodoModel {
    private todos: Todo[] = [];

    getTodos(): Todo[] {
        return this.todos;
    }
    getTodoById(todoId: Todo['id']) {
        return this.todos.find(todo => todo.id === todoId)
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
    setTodos(todos: Todo[]): void{
        this.todos = todos;
    }
    addTodo(todo: Todo) {
        this.todos.push(todo)
    }
    deleteTodo(todoId: Todo['id']) {
        this.todos = this.todos.filter(todo => todo.id !== todoId)
    }
    updateTodo(todoToUpdate: Todo) {
        this.todos = this.todos.map(todo => {
            if (todo.id === todoToUpdate.id) {
                return todoToUpdate
            }
            return todo
        })
    }
    toggleCompletedOfAll(isCompleted: boolean) {
        this.todos = this.todos.map(todo => ({...todo, completed: isCompleted}));
    }
}