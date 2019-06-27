import { uuid } from "../utils/utils";

export const TodoFactory = {
    createTodo(title: string) {
        return {
            id: uuid(),
            title,
            completed: false
        }
    }
}