type Todo = any

export interface Storage {
    getTodo(): Promise<Todo[]>,

    createTodo(todo: Todo): Promise<any>

    update(todo: Todo): Promise<any>

    destroy(id: Todo['id']): Promise<any>

    destroyCompleted(todos: Todo[]): Promise<any>
}