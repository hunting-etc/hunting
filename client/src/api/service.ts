export interface BaseUUIDSchema {
    id: string;
}

export interface Error {
    error: string;
}

export class ApiService<T> {
    baseUrl: string = "http://localhost:8000";
    //baseUrl: string = "http://26.73.223.97:8000";

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
          // Удаляем поле category из верхнего уровня и переносим его в type
          const { category, ...restData } = data; 
      
          const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...restData, // Добавляем оставшиеся данные
              type: {
                category: category // Переносим category в type
              }
            }),
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

    // async update(id: string, newData: Partial<T>, endpoint: string) {

    //     const { src, ...restData } = newData as { src?: File } & Partial<T>;
    //     let img= new FormData();
        
    //     if (src instanceof File) { // Проверяем, что src является экземпляром File
    //         img.append("photo", src); // Добавляем файл
    //     }
    //     console.log("xyi",img);

    //     const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
    //         method: 'PATCH',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(
    //             {...restData,
    //             photo:img
                    
    //             }


    //         ), // Отправляем только измененные данные

    //     });
    
    //     if (!response.ok) {
    //         const errorData = await response.json();
    //         throw new Error(errorData.message || 'Ошибка при сохранении данных');
    //     }
    
    //     return await response.json();
    // }
    async update(id: string, newData: Partial<T>, endpoint: string) {
        const { src, ...restData } = newData as { src?: File } & Partial<T>;
        
        const formData = new FormData();
    
        // Добавляем файл, если он существует
        if (src instanceof File) {
            formData.append("photo", src); 
        }
    
        // Добавляем остальные данные в FormData
        Object.entries(restData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
    
        console.log("FormData для отправки:", formData);
    
        const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
            method: 'PATCH',
            body: formData, // Отправляем FormData напрямую
        });
    
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.statusText}`);
        }
    
        return await response.json();
    }
    
    uploadImage(formData: FormData, id: string, endpoint: string) {
        return fetch(`${this.baseUrl}/${endpoint}/${id}`, {
          method: 'PATCH',
          body: formData
        });
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
    image: File | File | null;
    sortOrder: number | null;
    category: string;
}

export interface Info extends BaseUUIDSchema {
    description: string;
    
}

export class ChildService extends ApiService<Child> {}
export class InfoService extends ApiService<Info> {}


