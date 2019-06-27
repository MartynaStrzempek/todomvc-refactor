import axios from 'axios';
import { Todo } from "../types/types";

const API_URL = 'http://localhost:3000';

export function getTodos(): Promise<Todo[]> {
    return axios.get(`${API_URL}/todos`);
}

export function postTodo(todo: Todo): Promise<Todo> {
    return axios.post(`${API_URL}/todos`, todo);
}

export function putTodo(todo: Todo): Promise<Todo>{
    return axios.put(`${API_URL}/todos/${todo.id}`, todo);
}

export function deleteTodo(todo: Todo): Promise<Todo> {
    return axios.delete(`${API_URL}/todos/${todo.id}`);
}
