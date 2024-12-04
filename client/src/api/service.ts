export interface BaseUUIDSchema {
    id: string;
}

export interface Error {
    error: string;
}

export class ApiService<T> {
    baseUrl: string = "http://localhost:8000";

    /* public async getAll(prefix: string): Promise<T[]> {
        const response = await fetch(`${this.baseUrl}/${prefix}`);
        const jsonData = await response.json();
        return jsonData as T[];
    } */

        public async getAll(prefix: string, options: { category?: string; id?: string }): Promise<T[] | T> {
            let url = `${this.baseUrl}/${prefix}`;
        
            if (options.id) {
                url += `/${options.id}`;
            } else if (options.category) {
                url += `?category=${options.category}`;
            }
        
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ошибка при получении данных: ${response.statusText}`);
            }
        
            const jsonData = await response.json();
            return options.id ? (jsonData as T) : (jsonData as T[]);
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

    async create(data: Partial<Child>, endpoint: string = 'test/categories') {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
    
          if (!response.ok) {
            throw new Error(`Ошибка при создании данных: ${response.statusText}`);
          }
    
          const responseData = await response.json();
          console.log('Данные успешно созданы:', responseData);
          return responseData;
        } catch (error) {
          console.error('Ошибка при создании данных:', error);
          throw error;
        }
      }

    /* async update(id: string, newData: Partial<T>, endpoint: string) {
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

    // Отправка PATCH-запроса с измененными данными
    const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при сохранении данных');
    }

    return await response.json();
} */
    async update(id: string, newData: Partial<T>, endpoint: string) {
        const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData), // Отправляем только измененные данные
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при сохранении данных');
        }
    
        return await response.json();
    }
    
    

    public async delete(prefix: string, id: string, baseAdmin: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${baseAdmin}/${prefix}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при удалении данных');
        }
    }
}

export interface Child extends BaseUUIDSchema {
    h1: string | null | undefined;
  title: string | null | undefined;
  description: string | null | undefined;
  name: string | null | undefined;
  content: string | null | undefined;
    image: string | File | null;
    sortOrder: number | null;
    category: string;
}

export interface Info extends BaseUUIDSchema {
    description: string;
    
}

export class ChildService extends ApiService<Child> {}
export class InfoService extends ApiService<Info> {}


