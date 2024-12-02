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
      


      async update(id: string, newData: Partial<T>, endpoint: string) {
        // Получаем текущие данные с сервера
        const currentResponse = await fetch(`${this.baseUrl}/${endpoint}/${id}`);
        if (!currentResponse.ok) {
            const errorData = await currentResponse.json();
            throw new Error(errorData.message || 'Ошибка при получении текущих данных');
        }
        
        const currentData: T = await currentResponse.json();
    
        // Определяем измененные поля
        const updatedData: Partial<T> = {};
        for (const key in newData) {
            if (newData[key] !== currentData[key]) {
                updatedData[key] = newData[key];
            }
        }
    
        // Если нет изменений, не отправляем запрос
        if (Object.keys(updatedData).length === 0) {
            console.log('Нет изменений для отправки.');
            return;
        }
    
        // Отправляем только измененные данные
        const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при обновлении данных');
        }
    
        return await response.json();
    }

    public async delete(prefix: string,id: string, baseAdmin:string):Promise<void>{
        const response = await fetch(`${this.baseUrl}/${baseAdmin}/${prefix}/${id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', // Указание типа контента
            },
            
        });
    }
}


export interface Child extends BaseUUIDSchema {
    h1: string;
    title: string;
    description: string;
    name: string;
    content: string;
    sortOrder: number | null;
}

export interface Info extends BaseUUIDSchema {
    description: string;
}

export class ChildService extends ApiService<Child> {}
export class InfoService extends ApiService<Info> {}