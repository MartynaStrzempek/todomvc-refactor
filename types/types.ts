export interface Todo {
  id: string,
  title: string,
  completed: boolean
}

export type Filter = 'active' | 'completed' | 'all';