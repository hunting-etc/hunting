export interface BaseUUIDSchema {
    id?: string,
}

export interface Error {
    error: string
}

export class ApiService<T> {
    baseUrl: string = "http://localhost:8000"
    

    public async getAll(prefix: string): Promise<T[]> {
        const response = await fetch(`${this.baseUrl}/${prefix}`);
        const jsonData = await response.json()
        return jsonData as T[]
    }
    
    public async getByName(prefix: string, category: string): Promise<T[]> {
        const response = await fetch(`${this.baseUrl}/${prefix}?category=${category}`);
        if (!response.ok) {
            throw new Error(`Ошибка при получении данных: ${response.statusText}`);
        }
        const jsonData = await response.json();
        return jsonData as T[];
    }

    public async getById(prefix: string, id: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}/${prefix}/${id}`);
        if (!response.ok) {
            throw new Error(`Ошибка при получении данных: ${response.statusText}`);
        }
        const jsonData = await response.json();
        return jsonData as T;
    }

    public async create(data: T | FormData, prefix: string): Promise<void | Error> {
        
        const response = await fetch(`${this.baseUrl}/${prefix}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Указание типа контента
            },
            body: JSON.stringify(data)
        });
        if (response.status !== 200) {
            return await response.json() as Error
        }
        return response.json() ;
    }
    public async delete(prefix: string,id: string):Promise<void>{
        const response = await fetch(`${this.baseUrl}/${prefix}/${id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', // Указание типа контента
            },
            
        });
    }
    public async patch(prefix: string,id: string, data:T):Promise<void>{
        const response = await fetch(`${this.baseUrl}/${prefix}/${id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', // Указание типа контента
            },
            body: JSON.stringify(data)
        })
    }
}

export interface Post extends BaseUUIDSchema {
    summary:string
    main_photo:string
    header:string
    content:string
}

export class PostService extends ApiService<Post> {}


