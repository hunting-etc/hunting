export interface BaseUUIDSchema {
    id: string;
}

export interface Error {
    error: string;
}

export class ApiService<T> {
    baseUrl: string = "http://localhost:8000";

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

    async create(data: FormData, endpoint: string = 'test/categories') {
      try {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
          method: "POST",
          body: data, // Передаем FormData напрямую
        });
    
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
    
        return await response.json(); // Возвращаем распарсенный JSON
      } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
        throw error; // Пробрасываем ошибку для обработки в вызывающем коде
      }
    }
    

    async update(id: string, newData: FormData, endpoint: string) {
      const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
          method: 'PATCH',
          body: newData, // Отправляем FormData напрямую
      });
  
      if (!response.ok) {
          throw new Error(`Ошибка: ${response.statusText}`);
      }
  
      return await response.json();
  }
  
  
    
    imageURL: string = "http://localhost:8000/test/image";

    async uploadImage(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append("image", file);
    
        try {
          const response = await fetch(`${this.imageURL}/upload-image`, {
            method: "POST",
            body: formData,
          });
    
          if (!response.ok) {
            throw new Error(`Ошибка загрузки изображения: ${response.statusText}`);
          }
    
          return await response.json(); // Ожидаем, что сервер вернет объект с URL
        } catch (error) {
          console.error("Ошибка при загрузке изображения:", error);
          throw error;
        }
      }
      
      async deleteImage(imageUrl: string): Promise<void> {
        try {
          const response = await fetch(`${this.imageURL}/delete-image`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: imageUrl }),
          });
    
          if (!response.ok) {
            throw new Error(`Ошибка удаления изображения: ${response.statusText}`);
          }
    
          console.log("Изображение успешно удалено");
        } catch (error) {
          console.error("Ошибка при удалении изображения:", error);
          throw error;
        }
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
    h1: string;
    title?: string;
    description?: string;
    name?: string ;
    content?: string;
    photo?: File | null;
    sortOrder?: number;
    category?: string ;
    services?: Array<string>| null;
}

export interface Info extends BaseUUIDSchema {
    description: string;
    
}

export class ChildService extends ApiService<Child> {}
export class InfoService extends ApiService<Info> {}


