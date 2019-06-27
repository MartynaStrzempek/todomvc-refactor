import {Storage} from "./Storage";
import {RestStorage} from "./RestStorage";
import {LocalStorage} from "./local-storage";
import {Todo} from "../types/types";

enum StorageTypes {
    REST_STORAGE = 'REST_STORAGE',
    LOCAL_STORAGE = 'LOCAL_STORAGE'
}

export class SyncMultipleStorage implements Storage {
    public allStorages: { [key in StorageTypes]: Storage} = {
        [StorageTypes.REST_STORAGE]: new RestStorage(),
        [StorageTypes.LOCAL_STORAGE]: new LocalStorage()
    };
    private selectedStorages: Set<Storage> = new Set([this.allStorages.REST_STORAGE, this.allStorages.LOCAL_STORAGE]);

    public toggleStorageInSelected(event, storage: Storage) {
        const checkedInput = (<HTMLInputElement>(event.target)).checked;
        if (checkedInput) {
            this.selectedStorages.add(storage)
        } else {
            this.selectedStorages.delete(storage)
        }
    }

    public createTodo(todo: Todo): Promise<void> {
        return Promise.all(Array.from(this.selectedStorages).map(storage => storage.createTodo(todo))).then(e => e[0]);
    }

    public getTodos(): Promise<Todo[]> {
        return new Promise((resolve) => resolve(this.allStorages[StorageTypes.LOCAL_STORAGE].getTodos()));
    }

    public update(todo: Todo): Promise<void> {
        return Promise.all(Array.from(this.selectedStorages).map(storage => storage.update(todo))).then(e => e[0]);
    }

    public destroy(id: string): Promise<void> {
        return Promise.all(Array.from(this.selectedStorages).map(storage => storage.destroy(id))).then(e => e[0]);
    }

    public destroyCompleted(completedTodos: Todo[]): Promise<void> {
        return Promise.all(Array.from(this.selectedStorages).map(storage => storage.destroyCompleted(completedTodos)))
            .then(e => e[0]);
    }
    public updateAll(todos: Todo[]): Promise<void> {
        return Promise.all(Array.from(this.selectedStorages).map(storage => storage.updateAll(todos)))
            .then(e => e[0]);
    }
}