export interface BaseUUIDSchema {
    id: string;
}

export interface Error {
    error: string;
}

import { jwtDecode } from "jwt-decode";
import { emitter } from '../api/emmiter';



export class ApiService<T> {
    
    baseUrl: string = "http://localhost:8000";

    public isAccessTokenExpired(token: string): boolean {
      if (!token) return true;
  
      try {
        const decodedToken: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
      } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        return true;
      }
    }
    
  
    // Обновление access token
    public async refreshAccessToken(): Promise<string> {
      const refreshToken = localStorage.getItem('refresh_token');
    
      if (!refreshToken || this.isAccessTokenExpired(refreshToken)) {
        console.log('Refresh token отсутствует или истёк. Необходима повторная авторизация.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/admin'; // Перенаправление на страницу входа
        throw new Error('Refresh token истёк или отсутствует.');
      }
    
      try {
        const response = await fetch(`${this.baseUrl}/admin/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
              
              emitter.emit('toast', {
                severity: 'error',
                summary: 'Ошибка',
                detail: JSON.stringify(errorData) || 'Неизвестная ошибка',
                group: 'bl',
                life: 3000,
              });
          throw new Error(`Ошибка при обновлении токена: ${response.statusText}`);
        }
    
        const data = await response.json();
        const newAccessToken = data.access;
    
        // Сохраняем новый токен
        localStorage.setItem('access_token', newAccessToken);
        return newAccessToken;
      } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/admin'; // Перенаправление на страницу входа
        throw new Error('Не удалось обновить токен.');
      }
    }


    public async getAll(prefix: string, options: { category?: string; id?: string }): Promise<T[] | T> {
      let accessToken = localStorage.getItem('access_token');
      
      // Проверка истечения access token
        let url = `${this.baseUrl}/${prefix}`;
    
        if (options.id) {
            url += `/${options.id}`;
        } else if (options.category) {
            url += `?category=${options.category}`;
        }
    
        const response = await fetch(url,{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          
        });
        
        if (!response.ok) {
          const errorData = await response.json();
              
              emitter.emit('toast', {
                severity: 'error',
                summary: 'Ошибка',
                detail: JSON.stringify(errorData) || 'Неизвестная ошибка',
                group: 'bl',
                life: 3000,
              });
            throw new Error(`Ошибка при получении данных: ${response.statusText}`);
        }
    
        const jsonData = await response.json();
        return options.id ? (jsonData as T) : (jsonData as T[]);
    }

    public async getByName(prefix: string, category: string): Promise<T[]> {
      let accessToken = localStorage.getItem('access_token');
      if (!accessToken || this.isAccessTokenExpired(accessToken)) {
        console.log('Access token истёк. Обновляем токен...');
        accessToken = await this.refreshAccessToken();
      }
        const response = await fetch(`${this.baseUrl}/${prefix}?category=${category}`,{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          
        });
        if (!response.ok) {
          const errorData = await response.json();
              
              emitter.emit('toast', {
                severity: 'error',
                summary: 'Ошибка',
                detail: JSON.stringify(errorData) || 'Неизвестная ошибка',
                group: 'bl',
                life: 3000,
              });
            throw new Error(`Ошибка при получении данных: ${response.statusText}`);
        }
        const jsonData = await response.json();
        return jsonData as T[];
    }

    public async getById(prefix: string, id: string): Promise<T> {
      let accessToken = localStorage.getItem('access_token');
      if (!accessToken || this.isAccessTokenExpired(accessToken)) {
        console.log('Access token истёк. Обновляем токен...');
        accessToken = await this.refreshAccessToken();
      }
        const response = await fetch(`${this.baseUrl}/${prefix}/${id}`,{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          
        });
        if (!response.ok) {
          const errorData = await response.json();
              
              emitter.emit('toast', {
                severity: 'error',
                summary: 'Ошибка',
                detail: JSON.stringify(errorData) || 'Неизвестная ошибка',
                group: 'bl',
                life: 3000,
              });
            throw new Error(`Ошибка при получении данных: ${response.statusText}`);
        }
        const jsonData = await response.json();
        return jsonData as T;
    }

    async create(data: FormData, endpoint: string = 'admin/categories') {
      let accessToken = localStorage.getItem('access_token');
      if (!accessToken || this.isAccessTokenExpired(accessToken)) {
        console.log('Access token истёк. Обновляем токен...');
        accessToken = await this.refreshAccessToken();
      }
      try {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: data, // Передаем FormData напрямую
        });
    
        if (!response.ok) {
          const errorData = await response.json();
              
              emitter.emit('toast', {
                severity: 'error',
                summary: 'Ошибка',
                detail: JSON.stringify(errorData) || 'Неизвестная ошибка',
                group: 'bl',
                life: 3000,
              });
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
    
        return await response.json(); // Возвращаем распарсенный JSON
      } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
        throw error; // Пробрасываем ошибку для обработки в вызывающем коде
      }
    }
    

    async update(id: string, newData: FormData, endpoint: string) {
      let accessToken = localStorage.getItem('access_token');
      if (!accessToken || this.isAccessTokenExpired(accessToken)) {
        console.log('Access token истёк. Обновляем токен...');
        accessToken = await this.refreshAccessToken();
      }
      const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: newData, // Отправляем FormData напрямую
      });
  
      if (!response.ok) {
        const errorData = await response.json();
              
              emitter.emit('toast', {
                severity: 'error',
                summary: 'Ошибка',
                detail: JSON.stringify(errorData) || 'Неизвестная ошибка',
                group: 'bl',
                life: 3000,
              });
          throw new Error(`Ошибка: ${response.statusText}`);
      }
  
      return await response.json();
  }
  
  
    
    imageURL: string = "http://localhost:8000/admin/image";

    async uploadImage(file: File): Promise<{ url: string }> {
      let accessToken = localStorage.getItem('access_token');
      if (!accessToken || this.isAccessTokenExpired(accessToken)) {
        console.log('Access token истёк. Обновляем токен...');
        accessToken = await this.refreshAccessToken();
      }
        const formData = new FormData();
        formData.append("image", file);
    
        try {
          const response = await fetch(`${this.imageURL}/upload-image`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });
    
          if (!response.ok) {
            const errorData = await response.json();
              
              emitter.emit('toast', {
                severity: 'error',
                summary: 'Ошибка',
                detail: JSON.stringify(errorData) || 'Неизвестная ошибка',
                group: 'bl',
                life: 3000,
              });
            throw new Error(`Ошибка загрузки изображения: ${response.statusText}`);
          }
    
          return await response.json(); // Ожидаем, что сервер вернет объект с URL
        } catch (error) {
          console.error("Ошибка при загрузке изображения:", error);
          throw error;
        }
      }
      
      async deleteImage(imageUrl: string): Promise<void> {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken || this.isAccessTokenExpired(accessToken)) {
          console.log('Access token истёк. Обновляем токен...');
          accessToken = await this.refreshAccessToken();
        }
        try {
          const response = await fetch(`${this.imageURL}/delete-image`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: imageUrl }),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
              
              emitter.emit('toast', {
                severity: 'error',
                summary: 'Ошибка',
                detail: JSON.stringify(errorData) || 'Неизвестная ошибка',
                group: 'bl',
                life: 3000,
              });

            throw new Error(`Ошибка удаления изображения: ${response.statusText}`);
          }
    
          console.log("Изображение успешно удалено");
        } catch (error) {
          console.error("Ошибка при удалении изображения:", error);
          throw error;
        }
      }

    public async delete(prefix: string, id: string, baseAdmin: string): Promise<void> {
    
      let accessToken = localStorage.getItem('access_token');
      if (!accessToken || this.isAccessTokenExpired(accessToken)) {
        console.log('Access token истёк. Обновляем токен...');
        accessToken = await this.refreshAccessToken();
      }
        const response = await fetch(`${this.baseUrl}/${prefix}/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
       
        if (!response.ok) {
          const errorData = await response.json();
          
          emitter.emit('toast', {
            severity: 'error',
            summary: 'Ошибка',
            detail: JSON.stringify(errorData) || 'Неизвестная ошибка',
            group: 'bl',
            life: 3000,
          });

          // Отправляем ошибку в Toast
          

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
    category?: Category;
    sortOrder?: number;
}

export interface Info extends BaseUUIDSchema {
  h1: string;
  title?: string;
  description?: string;
  name?: string;
  content?: string;
  photo?: File | null;
  category?: Category;
  services?: Array<Service> | null;
  sortOrder?: number;
}

export interface Category {
  id: string;
  type: {
    id: number;
    category: string;
  };
  h1: string;
  title: string;
  description: string;
  name: string;
  photo: string;
  content: string;
}

// Интерфейс для услуги
export interface Service extends BaseUUIDSchema {
  id: string;
  category: Category;
  h1: string;
  title: string;
  description: string;
  name: string;
  photo: File | null;
  content: string;
  sortOrder?: number;
  price: string;
}

export class ChildService extends ApiService<Child> {
  fetch(arg0: string) {
    throw new Error("Method not implemented.");
  }
}
export class InfoService extends ApiService<Info> {}
export class ServService extends ApiService<Service> {}

