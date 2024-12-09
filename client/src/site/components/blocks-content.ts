import Swiper, {Navigation, Pagination} from 'swiper';
import YMLoader from '@/common/utils/ymaps-loader';
import {createElement} from '@/common/utils/dom';
import Modal, {MODALS_MODES} from "@/site/components/utils";
import SimpleBar from "simplebar";
import 'simplebar/dist/simplebar.min.css'


export default () => {
    const slides3 = document.querySelectorAll('.content-gallery-block');
    const modal = new Modal();

    const table = document.querySelector(".contentContentTable");

    if (table) {
    const contentCardTable = document.querySelector(".content-card-table");
        new SimpleBar(contentCardTable), {
            autoHide: true,
        };

        table.querySelectorAll("th").forEach(th => {
            if (th.offsetWidth > 320) {
                th.style.width = "320px";
                th.style.whiteSpace = "nowrap";
            }
        });
        table.querySelectorAll("td").forEach(td => {
            if (td.offsetWidth == 320) {
                td.style.width = "320px";
                td.style.minWidth = "320px";
                td.style.whiteSpace = "break-spaces";
            }
        });
    }

    document.querySelectorAll<HTMLElement>('.blocks-content').forEach(($container) => {
        // Init gallery
        $container.querySelectorAll<HTMLElement>('.blocks-content .content-gallery-block').forEach(($el) => {
            const swiper = new Swiper($el, {
                modules: [Navigation, Pagination],
                slidesPerView: 1.5,
                spaceBetween: 30,
                centeredSlides: true,
                loop: true,
                navigation: {
                    nextEl: $el.querySelector<HTMLElement>('.swiper-button-next'),
                    prevEl: $el.querySelector<HTMLElement>('.swiper-button-prev')
                },
                pagination: {
                    el: '.swiper-pagination',
                    type: 'bullets',
                    clickable: true,
                },
                on: {
                    init(sw) {
                        if (sw.slides.length <= 3) {
                            sw.params.slidesPerView = 1;
                            sw.params.centeredSlides = false;
                            sw.update();
                            slides3.forEach((el) => {
                                el.classList.add('slides3');
                            });
                        }
                    },
                }
            });

            const openModalButton = $el.querySelector('.swiper-wrapper');

            openModalButton?.addEventListener('click', () => {
                const imgs = [];
                openModalButton.querySelectorAll('img').forEach((item: HTMLImageElement) => {
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
        });

        // Init map
        $container.querySelectorAll<HTMLElement>('.content-map-block').forEach(($el) => {
            YMLoader.load().then((ymaps) => {
                const points = JSON.parse($el.dataset.points);

                const map = new ymaps.Map($el, {
                    controls: [
                        new ymaps.control.ZoomControl({options: {position: {right: 10, top: 15}}}),
                        // new ymaps.control.FullscreenControl({options: {position: {right: 10, top: 10}}}),
                        // @ts-ignore
                        // new ymaps.control.TypeSelector({options: {position: {right: 44, top: 10}}})
                    ],
                    center: points[0].coordinates,
                    zoom: 16
                }, {
                    // avoidFractionalZoom: true,
                    autoFitToViewport: 'always',
                    restrictMapArea: [[-Infinity, -85], [Infinity, 85]],
                    nativeFullscreen: true,
                    // suppressMapOpenBlock: true,
                    // copyrightLogoVisible: false,
                    copyrightProvidersVisible: false,
                    copyrightUaVisible: false
                });

                const cpane = $el.querySelector('[class*="-copyrights-pane"]');
                cpane?.parentElement.removeChild(cpane);

                const captionText = $el.dataset.caption;
                if (captionText) {
                    const caption = createElement('div', {
                        class: 'content-map-block-caption',
                    });

                    caption.innerHTML = `<i class="fas fa-location-dot"></i>  ${captionText}`;
                    $el.appendChild(caption);
                }

                points.forEach((pointData) => {
                    map.geoObjects.add(new ymaps.Placemark(pointData.coordinates, {}, {
                        preset: 'islands#greenDotIconWithCaption',
                        iconLayout: 'default#image',
                        iconImageHref: '/static/images/etc/yandex-map-style-point.svg',
                        iconImageSize: [26, 32]
                    }));
                });

                if (map.geoObjects.getLength() > 1) {
                    map.setBounds(map.geoObjects.getBounds(), {checkZoomRange: true, zoomMargin: [35]});
                }

                return map;
            });
        });
    });
}

