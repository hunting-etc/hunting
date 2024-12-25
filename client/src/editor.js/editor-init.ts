// editor-init.ts
import EditorJS, { LogLevels } from "@editorjs/editorjs";
import HeaderTool from '@editorjs/header';
import EmbedTool from '@editorjs/embed';
import ImageTool from '@editorjs/image';
import QuoteTool from '@editorjs/quote';
import GalleryTool from './tools/gallery';
import Table from '@editorjs/table';
import MapTool from './tools/map';
import CardTool, { CardToolData, CardType } from './tools/card';
import JSCookie from '../common/utils/cookie';




export const initEditor = (element: HTMLElement, data: any = null) => {
  let previousData: any = [];
  let serverImage: string[] = [];
  let serverGallery:string[] = [];
// Используем Optional Chaining для безопасного доступа к blocks
  previousData = data ?? []; // Если data нет, присваиваем пустой массив
  
  serverImage = previousData?.blocks?.filter((block) => block.type === 'image')
    .map((block) => block.data.file.url) || [];
  serverGallery = previousData?.blocks?.filter((block) => block.type === 'gallery')
    .map((block) => block.data.files.map((file) => file.url)) || [];

  
  // const pxroxyurl=uselessurl.forEach(url=>deleteImage(url))
  const pendingDeletions: string[] = [];
  const deleteImage = (fileUrl: string) => {

    
    console.log('Удаление изображения:', fileUrl);
    const imageName = fileUrl.split('/').pop(); // например, если fileUrl = 'http://localhost:8000/uploads/myimage.jpg', то imageName будет 'myimage.jpg'
    console.log('Имя файла для удаления:', imageName);
    return fetch(`http://127.0.0.1:8000/test/image/${imageName}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_url: fileUrl })
    }).then((response) => {
      if (!response.ok) {
        alert('Ошибка при удалении изображения. Свяжитесь с администратором.');
      }
    });
  };


  const addDeletion = (fileUrl: string) => {
    if (!pendingDeletions.includes(fileUrl)) {
      pendingDeletions.push(fileUrl);
      console.log(`Добавлен URL для удаления: ${fileUrl}`);
    }
  };

  const processPendingDeletions = async (action:string) => {
    if (action === 'delete') {
    for (const url of pendingDeletions) {
      deleteImage(url);
    }
    console.log('Все ожидающие URL успешно удалены.');
    pendingDeletions.length = 0;
    }
    if (action === 'fulldelite') {
      editor.save().then((currentData) => {
        // Обработка блоков типа 'image'
        const currentImages = currentData.blocks
          .filter((block) => block.type === 'image')
          .map((block) => block.data.file.url);
    
        const deletedImages = currentImages.filter((ing) => !serverImage.includes(ing));
        console.log("deletedImages",deletedImages)
        for (const url of pendingDeletions) {
          const isImageBlock = currentImages.includes(url);
          if (!serverImage.includes(url)&& isImageBlock) {
            // Если изображения нет на сервере, удаляем его
            deleteImage(url); // Используем await, если deleteImage является асинхронной функцией
          }
        }
        deletedImages.forEach((url) => deleteImage(url))
    
        // deletedImages.forEach((url) => deleteImage(url));
    
        // Обработка блоков типа 'gallery'
        const currentGalleryUrls = currentData.blocks
          .filter((block) => block.type === 'gallery')
          .flatMap((block) => block.data.files.map((file) => file.url));
        console.log("currentGalleryUrls",currentGalleryUrls)
        const flattenedServerGallery = serverGallery.flat();
        const deletedGalleryUrls = currentGalleryUrls.filter(
          (url) => !flattenedServerGallery.includes(url)
        );
        console.log("serverGallery",serverGallery)
        console.log("deletedGalleryUrls",deletedGalleryUrls)
        for (const url of pendingDeletions) {
          const isGalleryBlock = currentGalleryUrls.includes(url);
          if (!flattenedServerGallery.includes(url)&&isGalleryBlock) {
            
            // Если изображения нет на сервере, удаляем его
            deleteImage(url); 
          }
        }
        deletedGalleryUrls.forEach((url) => deleteImage(url));
        
        console.log('Все удалено.');
      });
    } // Очистка массива после обработки
  };
  


  
  const uploadImage = (image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('csrfmiddlewaretoken', JSCookie.get('csrftoken')!);

    return fetch('http://127.0.0.1:8000/test/image', {
        method: 'post',
        body: formData
    }).then((response) => {
        if (!response.ok) {
            if (response.status == 400) {
                alert('Картинка слишком большая, уменьшите картинку и повторите попытку')
            } else if (response.status == 403) {
                alert('Отказано в доступе при загрузке картинок. Свяжитесь с администратором')
            }
            return null
        } else {
            return response.json();
        }
    }).then((data) => {
        if (data) {
            return {
                success: 1,
                file: data
            };
        } else {
            return {
                success: 0,
                file: null
            }
        }
    })
};

  const editor = new EditorJS({
    holder: element,
    logLevel: 'ERROR' as LogLevels,
    data,
    onReady: () => {
      console.log()
    },
    tools: {
      header: {
        class: HeaderTool,
        config: {
          levels: [2, 3],
          defaultLevel: 2
        }
      },
      quote: {
        class: QuoteTool,
        config: {
          quotePlaceholder: 'Введите цитату',
          captionPlaceholder: 'Введите подпись'
        }
      },
      embed: {
        class: EmbedTool,
        config: {
          services: {
            youtube: true,
            okru: {
              regex: /https?:\/\/ok\.ru\/video\/(\d+)/,
              embedUrl: 'https://ok.ru/videoembed/<%= remote_id %>',
              html: '<iframe src="{0}" height="300" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 100%; height: 300px;"></iframe>',
              height: 300,
              width: 600,
              id: (groups: any[]) => groups.join('/embed/')
            }
          }
        }
      },
      image: {
        class: ImageTool,
        config: {
          endpoints: {
            byFile: 'http://localhost:8000/admin/media'
          },
          uploader: {
            uploadByFile: uploadImage
          },
          onRemove: (data: { file: { url: string; }; }) => {
            if (data.file && data.file.url) {
              addDeletion(data.file.url);
            }
          }
        }
      },
      gallery: {
        class: GalleryTool,
        config: {
          uploader: {
            uploadByFile: uploadImage
          },
          onRemove: (data: { file: { url: string; }; }) => {
            if (data.file && data.file.url) {
              addDeletion(data.file.url);
            }
          }
        }
      },
      card: {
        class: CardTool,
        config: {
          cardListUrl: (type: CardType, search: string) => `/admin/api/card-select/${type}?search=${search}`,
          cardUrl: (data: CardToolData) => `/admin/api/card/${data.type}/${data.id}`
        }
      },
      map: {
        class: MapTool,
        config: {
          center: [30.202880, 55.184220]
        }
      },
      table: {
        class: Table,
        config: {
          rows: 2,
          cols: 2,
        }
      },
      
    },
    
    
    
    
    onChange() {
      editor.save().then((currentData) => {
        // console.log('check',currentData.blocks.some((block) => block.type === 'gallery')||(previousData?.blocks).filter((block) => block.type === 'gallery').flatMap((block) => block.data.files.map((file) => file.url)).length>=0)
         // Проверка и обработка блоков типа 'gallery'
        // if (currentData.blocks.some((block) => block.type === 'gallery')||(previousData?.blocks).filter((block) => block.type === 'gallery').flatMap((block) => block.data.files.map((file) => file.url)).length>=0) {
          // Получаем предыдущие URL-адреса из галерей
          console.log("previousData after chenge",previousData)
          const previousGalleries = (previousData?.blocks || [])
            .filter((block) => block.type === 'gallery')
            .flatMap((block) => block.data.files.map((file) => file.url)); // Извлекаем все URL из массива files
          console.log('previousGalleries',previousGalleries)
          // Получаем текущие URL-адреса из галерей
          const currentGalleries = currentData.blocks
            .filter((block) => block.type === 'gallery')
            .flatMap((block) => block.data.files.map((file) => file.url)); // Извлекаем все URL из массива files
            console.log('currentGalleries',currentGalleries)
          // Находим удаленные элементы
          const deletedGalleries = previousGalleries.filter(
            (url) => !currentGalleries.includes(url)
          );
          // Добавляем удаленные URL в список на удаление
          deletedGalleries.forEach((url) => addDeletion(url));
          
        // }
    
        // Проверка на наличие блоков типа 'image' в currentData
        // if (currentData.blocks.some((block) => block.type === 'image')||(previousData?.blocks || []).filter((block) => block.type === 'image').map((block) => block.data.file.url).length>=0) {
          // Получаем предыдущие URL-адреса изображений
          const previousImages = (previousData?.blocks || [])
            .filter((block) => block.type === 'image')
            .map((block) => block.data.file.url);
            console.log('previousGalleries',previousImages)
          // Получаем текущие URL-адреса изображений
          const currentImages = currentData.blocks
            .filter((block) => block.type === 'image')
            .map((block) => block.data.file.url);
            console.log('currentGalleries',currentImages)
          // Находим элементы, которые были удалены
          const deletedImages = previousImages.filter(
            (url) => !currentImages.includes(url)

          
          );
    
          // Для каждой удаленной картинки добавляем в список на удаление
          deletedImages.forEach((url) => addDeletion(url));
           // Убираем null (удалённые блоки)
        // }
        // Обновляем предыдущее состояние
       
        previousData=JSON.parse(JSON.stringify(currentData));
        console.log('previousData after change',previousData)
      });
    },
    
    i18n: {
        messages: {
            ui: {
                blockTunes: {
                    toggler: {
                        'Click to tune': 'Нажмите для настройки',
                        'or drag to move': 'или перетащите'
                    }
                },
                inlineToolbar: {
                    converter: {
                        'Convert to': 'Конвертировать'
                    }
                },
                toolbar: {
                    toolbox: {
                        'Add': 'Добавить'
                    }
                },
                popover: {
                    'Filter': 'Фильтр',
                    'Nothing found': 'Ничего не найдено'
                }
            },
            toolNames: {
                'Bold': 'Жирный',
                'Italic': 'Курсив',
                'Link': 'Ссылка',
                'Text': 'Параграф',
                'Heading': 'Заголовок',
                'Quote': 'Цитата',
                'Image': 'Фото',
                'Gallery': 'Галерея',
                'Card': 'Карточка',
                'Map': 'Карта',
                'Table': 'Таблица',
            },
            tools: {
                table: {
                    'Add row above': 'Добавить строку выше',
                    'Add row below': 'Добавить строку ниже',
                    'Delete row': 'Удалить строку',
                    'Delete column': 'Удалить столбец',
                    'Delete table': 'Удалить таблицу',
                    'Add column to left': 'Добавить колонку слева',
                    'Add column to right': 'Добавить колонку справа',
                    'Heading': 'Заголовок',
                    'With headings': 'С заголовками',
                    'Without headings': 'Без заголовков',
                },
                link: {
                    'Add a link': 'Добавить ссылку'
                },
                stub: {
                    'The block can not be displayed correctly.': 'Блок не может быть отображен'
                },
                header: {
                    'Heading 1': 'Заголовок H1',
                    'Heading 2': 'Заголовок H2',
                    'Heading 3': 'Заголовок H3',
                    'Heading 4': 'Заголовок H4',
                    'Heading 5': 'Заголовок H5',
                    'Heading 6': 'Заголовок H6'
                },
                gallery: {
                    'Add images': 'Добавить',
                    'Caption': 'Подпись'
                },
                image: {
                    'Select an Image': 'Выбрать',
                    'Caption': 'Подпись',
                    'With border': 'С рамкой',
                    'Stretch image': 'На всю ширину',
                    'With background': 'С фоном'
                },
                quote: {
                    'Enter a quote': 'Введите цитату',
                    'Enter a caption': 'Введите подпись'
                },
                card: {
                    'Select': 'Выбрать',
                    'Select card': 'Выбрать карточку',
                    'Search': 'Поиск'
                },
                map: {
                    'Caption': 'Подпись'
                }
            },
            blockTunes: {
                delete: {
                    'Delete': 'Удалить',
                    'Click to delete': 'Подтвердить удаление'
                },
                moveUp: {
                    'Move up': 'Переместить вверх'
                },
                moveDown: {
                    'Move down': 'Переместить вниз'
                }
            }
        }
    }
  });
  return {
    editorInstance: editor,
    processPendingDeletions,
  };
};