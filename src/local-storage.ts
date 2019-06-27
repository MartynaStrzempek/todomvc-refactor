import { Storage } from "./Storage";
import { Todo } from "../types/types";

const LOCAL_STORAGE_TODOS_KEY = 'todos-jquery';

export class LocalStorage implements Storage {
    private dumpToLocalStorage = (todos: Todo[]): void => {
        localStorage.setItem(LOCAL_STORAGE_TODOS_KEY, JSON.stringify(todos));
    };

    private loadFromLocalStorage = (): Todo[] => {
        let store = localStorage.getItem(LOCAL_STORAGE_TODOS_KEY);
        return (store && JSON.parse(store)) || [];
    };

    public getTodos(): Promise<Todo[]> {
        return new Promise((resolve) => resolve(this.loadFromLocalStorage()));
    }

    public createTodo(todo: Todo): Promise<any> {
        this.dumpToLocalStorage([...this.loadFromLocalStorage(), todo]);
        return new Promise((resolve) => resolve([]))
    }

    public update(todo: Todo): Promise<any> {
        this.dumpToLocalStorage(this.loadFromLocalStorage().map(lsTodo => {
            if (todo.id === lsTodo.id) {
                lsTodo = todo;
            }
            return lsTodo
        }));
        return new Promise((resolve) => resolve([]))
    }

    public destroy(todoId: string): Promise<any> {
        this.dumpToLocalStorage(this.loadFromLocalStorage().filter(lsTodo => {
            return lsTodo.id !== todoId
        }));
        return new Promise((resolve) => resolve([]))
    }

    public destroyCompleted(completedTodos: Todo[]): Promise<any> {
        this.dumpToLocalStorage(this.loadFromLocalStorage().filter(lsTodo => {
            return !completedTodos.some(todo => lsTodo.id !== todo.id)
        }));
        return new Promise((resolve) => resolve([]))
    }

    updateAll(todos: Todo[]): Promise<any> {
        localStorage.setItem(
            LOCAL_STORAGE_TODOS_KEY,
            JSON.stringify(todos)
        );
        return new Promise((resolve) => resolve([]))
    }
}