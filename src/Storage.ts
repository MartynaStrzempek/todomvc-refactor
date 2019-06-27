import { Todo } from "../types/types";

export interface Storage {
    getTodos(): Promise<Todo[]>,

    createTodo(todo: Todo): Promise<any>

    update(todo: Todo): Promise<any>

    destroy(id: Todo['id']): Promise<any>

    destroyCompleted(completedTodos: Todo[]): Promise<any>
}