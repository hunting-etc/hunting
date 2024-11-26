export interface BaseIDSchema {
    id: number;
}

export interface Error {
    error: string;
}

export class ApiService<T> {
    baseUrl: string = "http://localhost:8000/admin";

    public async getAll(prefix: string): Promise<T[]> {
        const response = await fetch(`${this.baseUrl}/${prefix}`);
        if (!response.ok) {
            throw new Error("Ошибка загрузки данных");
        }
        const jsonData = await response.json();
        return jsonData as T[];
    }

    public async create(data: T, prefix: string): Promise<void | Error> {
        const response = await fetch(`${this.baseUrl}/${prefix}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (response.status !== 200) {
            return await response.json() as Error;
        }
        return;
    }
}

export interface Parent extends BaseIDSchema {
    title: string;
}

export interface Child extends BaseIDSchema {
    title: string;
    parentId: string;
}

export interface MetaSchema {
    h1: string;
    title: string;
    description: string;
}

export interface Info extends BaseIDSchema, MetaSchema {
    title: string;
    description: string;
} 

export class ParentService extends ApiService<Parent> {}
export class ChildService extends ApiService<Child> {}
export class InfoService extends ApiService<Info> {
    // Новый метод для загрузки категорий
    public async getCategories(context: string): Promise<Info[]> {
        const response = await fetch(`${this.baseUrl}/${context}/categories`);
        if (!response.ok) {
            throw new Error("Ошибка загрузки категорий");
        }
        const jsonData = await response.json();
        return jsonData as Info[];
    }
}