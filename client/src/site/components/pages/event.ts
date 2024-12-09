import Swiper, {Navigation} from "swiper";
import {gradientUtils} from "../utils";
import YMHelper, {PointCoordinates} from '../../../editor.js/tools/map/helper';

export function initNewsEventSwiper() {
    if (document.querySelector('.news-block-items')) {
        const swiperNewsGradient = <HTMLDivElement>document.querySelector('.news-block-items .shadow-gradient')
        new Swiper(".news-block-items", {
            modules: [Navigation],
            slidesPerView: 'auto',
            spaceBetween: 4,
            navigation: {
                nextEl: ".news-block-content .nb-r",
                prevEl: ".news-block-content .nb-l",
            },
            on: {
                init(sw) {
                    if (sw.params.slidesPerView >= sw.slides.length || sw.slides.length < 2) {
                        if (swiperNewsGradient) {
                            swiperNewsGradient.classList.add('off');
                        }
                    }
                },
                ...gradientUtils(swiperNewsGradient)
            }
        });
    }
}

export function initMemberEventSwiper() {
    if (document.querySelector('.members-block-items')) {
        const swiperNewsGradient = <HTMLDivElement>document.querySelector('.members-block-items .shadow-gradient')
        new Swiper(".members-block-items", {
            modules: [Navigation],
            slidesPerView: 'auto',
            spaceBetween: 12,
            navigation: {
                nextEl: ".members-block-content .mb-r",
                prevEl: ".members-block-content .mb-l",
            },
            on: {
                init(sw) {
                    if (sw.params.slidesPerView >= sw.slides.length || sw.slides.length < 2) {
                        if (swiperNewsGradient) {
                            swiperNewsGradient.classList.add('off');
                        }
                    }
                },
                ...gradientUtils(swiperNewsGradient)
            }
        });
    }
}

export function initYandexMap() {
    const map = document.querySelector('.ya-map') as HTMLElement;
    if (map) {
        const latitude = map.getAttribute('data-latitude');
        const longitude = map.getAttribute('data-longitude');
        if (latitude && longitude) {
            const location = [parseFloat(longitude), parseFloat(latitude)] as PointCoordinates

            YMHelper.init(map, {
                center: location,
                zoom: 16
            }).then((map) => {
                map.behaviors.disable('scrollZoom');

                const mark = YMHelper.placemark(location, {}, {draggable: true}, {
                    dragend: (e) => {
                        const location = e.originalEvent.target.geometry.getCoordinates();
                        map.panTo(location, {flying: true});
                    }
                });

                map.geoObjects.add(mark);
            });
        }
    }
}
