import { Storage } from "./Storage";
import { Todo } from "../types/types";
import { Promise } from 'es6-promise'

const LOCAL_STORAGE_TODOS_KEY = 'todos-jquery';

export class LocalStorage implements Storage {
    getTodos(): Promise<Todo[]> {
        return new Promise((resolve) => resolve(JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODOS_KEY))))
    }

    createTodo(todo: Todo): Promise<any> {
        localStorage.setItem(
            LOCAL_STORAGE_TODOS_KEY,
            JSON.stringify([...JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODOS_KEY)), todo])
        );
        return new Promise((resolve) => resolve([]))
    }

    update(todo: Todo): Promise<any> {
        localStorage.setItem(
            LOCAL_STORAGE_TODOS_KEY,
            JSON.stringify([...JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODOS_KEY)).map(lsTodo => {
                if (todo.id === lsTodo.id) {
                    todo = lsTodo;
                }
                return todo
            })])
        );
        return new Promise((resolve) => resolve([]))
    }

    destroy(todoId: string): Promise<any> {
        localStorage.setItem(
            LOCAL_STORAGE_TODOS_KEY,
            JSON.stringify([...JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODOS_KEY)).filter(lsTodo => {
                return lsTodo.id !== todoId
            })])
        );
        return new Promise((resolve) => resolve([]))
    }

    destroyCompleted(completedTodos: Todo[]): Promise<any> {
        localStorage.setItem(
            LOCAL_STORAGE_TODOS_KEY,
            JSON.stringify([...JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODOS_KEY)).filter(lsTodo => {
                return !completedTodos.some(todo => lsTodo.id !== todo.id)
            })])
        );
        return new Promise((resolve) => resolve([]))
    }
}