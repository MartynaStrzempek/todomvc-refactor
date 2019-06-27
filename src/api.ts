import axios from 'axios';
const API_URL = 'http://localhost:3000';

export function getTodos(): Promise<any> {
    return axios.get(`${API_URL}/todos`);
}

export function postTodo(todo: any): Promise<any> {
    return axios.get(`${API_URL}/todos`, todo);
}

export function putTodo(todo: any): Promise<any>{
    return axios.get(`${API_URL}/todos/${todo.id}`, todo);
}

export function deleteTodo(todo: any): Promise<any> {
    return axios.get(`${API_URL}/todos/${todo.id}`);
}

export function deleteTodos(): Promise<any> {
    return axios.get(`${API_URL}/todos`);
}