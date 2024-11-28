export interface BaseUUIDSchema {
    id: string,
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

    /* public async create(data: T, prefix: string): Promise<void | Error> {
        const response = await fetch(`${this.baseUrl}/${prefix}`, {
            body: JSON.stringify(data)
        });
        if (response.status !== 200) {
            return await response.json() as Error
        }
        return
    } */

    async create(data: Child, endpoint: string) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
          method: 'POST', // Измените на POST
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data), // Добавьте данные в теле запроса
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка при сохранении данных');
        }
    
        return await response.json();
      }
      
      async update(id: string, data: Partial<T>, endpoint: string) {
        const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
            method: 'PATCH', // Метод для обновления
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Добавьте данные для обновления
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при обновлении данных');
        }

        return await response.json();
    }
}


export interface Child extends BaseUUIDSchema {
    h1:string;
    title: string;
    description:string;
    name:string;
    content:string;
    // parentId: string;
}

export interface Info extends BaseUUIDSchema {
    description: string;
}

export class ChildService extends ApiService<Child> {}
export class InfoService extends ApiService<Info> {}