import { Todo } from "./Todo";

export interface Storage {
    getTodos(): Promise<Todo[]>,

    createTodo(todo: Todo): Promise<void>

    update(todo: Todo): Promise<void>

    destroy(id: Todo['id']): Promise<void>

    destroyCompleted(completedTodos: Todo[]): Promise<void>

    updateAll(todos: Todo[]): Promise<void>
}