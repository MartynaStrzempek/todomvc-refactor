import { Storage } from "./Storage";
import * as api from './api'
import { Todo } from "../types/types";

export class RestStorage implements Storage {
    getTodo(): Promise<Todo[]> {
        return api.getTodos();
    }    
    createTodo(todo: Todo): Promise<any> {
        return api.postTodo(todo);
    }
    update(todo: Todo): Promise<any> {
        return api.putTodo(todo)
    }
    destroy(id: Todo['id']): Promise<any> {
        return api.deleteTodo(id)
    }
    destroyCompleted(completedTodos: Todo[]): Promise<any> {
        return Promise.all([completedTodos.map(todo => api.deleteTodo(todo.id))])
    }
}

export const RestStorageFunctional: () => Storage = () => {
    return {
        getTodo(): Promise<Todo[]> {
            return api.getTodos();
        },    
        createTodo(todo: Todo): Promise<any> {
            return api.postTodo(todo);
        },
        update(todo: Todo): Promise<any> {
            return api.putTodo(todo)
        },
        destroy(id: Todo['id']): Promise<any> {
            return api.deleteTodo(id)
        },
        destroyCompleted(completedTodos: Todo[]): Promise<any> {
            return Promise.all([completedTodos.map(todo => api.deleteTodo(todo.id))])
        }
    }
}