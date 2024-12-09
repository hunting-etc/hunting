import {Dropdown} from '../dropdown';
import Modal, {gradientUtils, MODALS_MODES, queryParameters} from '../utils';
import {Navigation, Swiper, Thumbs} from 'swiper';

export function callBandPagination(tag: HTMLDivElement | Document = document) {
    tag.querySelectorAll('.pagination-band-a__item').forEach((element) => {
        element.addEventListener('click', () => {
            const {value: query_name} = <HTMLInputElement>document.getElementById('band-search');

            const page_num = element.getAttribute('data-page-num');
            const country = element.getAttribute('data-country');
            const style = element.getAttribute('data-style');

            getBandPaginationData(query_name, page_num, style, country);
        });
    });
}

function getBandPaginationData(query_name, page_num, style_id, country_id) {
    const name = query_name ? `search=${query_name}&` : '';
    const country = country_id ? `&country=${country_id}` : '';
    const style = style_id ? `&style=${style_id}` : '';

    fetch(`fetch-data?${name}page=${page_num}${country}${style}`).then((response) => {
        return response.text();
    }).then((data) => {
        const block = <HTMLDivElement>document.querySelector('.band-page__content');
        block.innerHTML = data;
        callBandPagination(block);
        window.scrollTo(0, 0);
        history.pushState({}, null, `?${name}page=${page_num}${country}${style}`);
    });
}

export function initBandFilter() {
    const searchInput = <HTMLInputElement>document.getElementById('band-search');
    const dropdown = Dropdown.namedDropdowns;

    function onBandFilterChange() {
        const pageNum = 1;
        const {value: queryName} = searchInput;
        const style = dropdown['style-filter'].selectedOption ? dropdown['style-filter'].selectedOption.value : null;
        const country = dropdown['country-filter'].selectedOption ? dropdown['country-filter'].selectedOption.value : null;
        getBandPaginationData(queryName, pageNum, style, country);
    }

    if (searchInput) {
        searchInput.addEventListener('input', onBandFilterChange);
        let queryParameter = <Record<string, any>>queryParameters();


        const styleFilterDropdown = dropdown['style-filter'];
        const styleClearButton = <HTMLElement>document.querySelector('.clear-category');

        if (styleFilterDropdown && styleClearButton) {

            styleFilterDropdown.callBack = onBandFilterChange;

            const value = queryParameter['style'];
            if (value) {
                styleFilterDropdown.selectOptionByValue(value);
            }

            styleClearButton.addEventListener('click', () => {
                if (styleFilterDropdown.selectedOption) {
                    styleFilterDropdown.onSelectOption(styleFilterDropdown.selectedOption);
                }
            });

        }

        const countryFilterDropdown = dropdown['country-filter'];
        const countryClearButton = <HTMLElement>document.querySelector('.clear-country');

        if (countryFilterDropdown && countryClearButton) {

            countryFilterDropdown.callBack = onBandFilterChange;

            const value = queryParameter['country'];
            if (value) {
                countryFilterDropdown.selectOptionByValue(value);
            }

            countryClearButton.addEventListener('click', () => {
                if (countryFilterDropdown.selectedOption) {
                    countryFilterDropdown.onSelectOption(countryFilterDropdown.selectedOption);
                }
            });
        }
    }
}


export function initBandPage() {
    const block = document.querySelector('.band-page__description__main-info__awards');
    const button = document.getElementById('award-show-more__button');
    if (block) {
        if (block.children.length > 4) {
            button.addEventListener('click', () => {
                if (block.classList.contains('compact')) {
                    block.classList.remove('compact');
                    block.classList.add('full');
                } else {
                    block.classList.add('compact');
                    block.classList.remove('full');
                }
                button.innerHTML = block.classList.contains('compact') ? 'Показать ещё...' : 'Скрыть';
            });
        }
    }
}


export function initBandSwipers() {
    const swiperNewsGradient = <HTMLDivElement>document.querySelector('.swiper-news .shadow-gradient');
    const swiperEventGradient = <HTMLDivElement>document.querySelector('.swiper-event .shadow-gradient');
    let swiper = null;

    if (document.querySelector('.item-swiper')) {
        swiper = new Swiper('.item-swiper', {
            modules: [Navigation, Thumbs],
            navigation: {
                nextEl: '.swiper-thumbs-block .next',
                prevEl: '.swiper-thumbs-block .prev'
            },
            thumbs: {
                swiper: new Swiper('.item-swiper-thumbs', {
                    breakpoints: {
                        426: {
                            slidesPerView: 5,
                            spaceBetween: 4.82,
                            direction: 'vertical'
                        },
                        350: {
                            spaceBetween: 4.82,
                            slidesPerView: 3.5,
                            direction: 'horizontal'
                        },
                        1: {
                            spaceBetween: 4.82,
                            slidesPerView: 2.8,
                            direction: 'horizontal'
                        }
                    },
                    on: {
                        init(sw) {
                            sw.updateSlides();
                        }
                    }
                })
            }
        });
    }


    if (document.querySelector('.swiper-news')) {
        new Swiper('.news-block-items-block .swiper-news', {
            modules: [Navigation],
            navigation: {
                nextEl: ".nb-r",
                prevEl: ".nb-l"
            },
            slidesPerView: "auto",
            spaceBetween: 6,
            on: {
                init(sw) {
                    if (sw.params.slidesPerView >= sw.slides.length || sw.slides.length < 2) {
                        swiperNewsGradient.classList.add('off');
                    }
                },
                ...gradientUtils(swiperNewsGradient)
            }
        });
    }
    if (document.querySelector('.swiper-event')) {
        new Swiper('.swiper-event', {
            modules: [Navigation],
            navigation: {
                nextEl: '.eb-r',
                prevEl: '.eb-l'
            },
            slidesPerView: 'auto',
            spaceBetween: 13,
            on: {
                init(sw) {
                    if (sw.params.slidesPerView >= sw.slides.length || sw.slides.length < 2) {
                        swiperEventGradient.classList.add('off');
                    }
                },
                ...gradientUtils(swiperEventGradient)
            }
        });
    }
// const modal = document.querySelector('.modal');
// openModalButton.addEventListener('click', function () {
//     modal.style.display = 'grid';
//     swiper_modal.slideTo(swiper.activeIndex);
//     document.body.style.overflow = 'hidden';
// });
// if(document.querySelector(".swiper-modal")) {
// const swiper_modal = new Swiper(".swiper-modal", {
//     slidesPerView: 1,
//     navigation: {
//         nextEl: ".modal-next",
//         prevEl: ".modal-prev",
//     },
//     thumbs: {
//         swiper: {
//             el: ".modal-swiper-thumbs",
//             navigation: {
//                 nextEl: ".modal-swiper-thumbs .next",
//                 prevEl: ".modal-swiper-thumbs .prev",
//             },
//             slidesPerView: 'auto',
//             direction: 'horizontal',
//             spaceBetween: 8,
//         }
//     },
//     on: {
//         init(sw){
//             sw.slideTo(swiper.activeIndex)
//         },
//     }
// });
// }
// const closeModalButton = document.querySelector('.close-modal-button');
// closeModalButton.addEventListener('click', function () {
//     modal.style.display = 'none';
//     swiper.slideTo(swiper_modal.activeIndex);
//     document.body.style.overflow = 'unset';
// });
    const openModalButton = document.querySelector('.item-swiper .swiper-wrapper');
    const modal = new Modal();
    openModalButton?.addEventListener('click', () => {
        const imgs = [];
        document.querySelectorAll('.item-swiper .swiper-wrapper img').forEach((item: HTMLImageElement) => {
            imgs.push(item.src);
        });

        modal.closeCallback = () => {
            if (modal.defaultGallerySwiper) {
                swiper.slideTo(modal.defaultGallerySwiper.activeIndex);
            }
        };

        let slides = null;

        if (imgs.length == 1) {
            slides = imgs[0];
            modal.showModalWithSimplePhoto(slides);
        } else {
            slides = {
                slider: imgs || [],
                thumbs: imgs || []
            };
            if (modal.mode === MODALS_MODES.GALLERY) {
                modal.changeSlides(slides);
                modal.showModal(swiper.activeIndex);
            } else {
                modal.showWithGallery(slides, swiper.activeIndex);
            }
        }

    });
}
