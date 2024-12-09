import {Manipulation, Navigation, Swiper, Thumbs} from "swiper";

export function gradientUtils(gradient: HTMLElement) {
    return {
        fromEdge: () => {
            if (gradient) {
                gradient.classList.remove('only-end', 'only-start');
            }
        },
        reachBeginning: () => {
            if (gradient) {
                gradient.classList.add('only-end');
            }
        },
        reachEnd: () => {
            if (gradient) {
                gradient.classList.add('only-start');
            }
        }
    }
}

export const ESCAPE = 'Escape';

// const MODALS_KEYS = {
//     RECORD_GALLERY: 'record-slider',
//     RECORD_VIDEO: 'record-video',
//     SIMPLE_PHOTO: 'simple-photo'
// }

export const MODALS_MODES = {
    GALLERY: 'gallery',
    IMAGE: 'image'
}

const GALLERY_HTML = `
    <div class="slider-container">
        <div id="modal-gallery">
            <div class="swiper-wrapper">
            </div>
        </div>
        <div class="swiper-prev-modal"><i class="fa-light fa-angle-left"></i></div>
        <div class="swiper-next-modal"><i class="fa-light fa-angle-right"></i></div>
    </div>
    <div class="slider-container">
        <div id="modal-gallery-thumbs">
            <div class="swiper-wrapper">
            </div>
        </div>
    </div>
    <div id="modal-swiper-pagination"></div>
`;


export default class Modal {
    static self: Modal = null;

    modalBlock: HTMLDivElement = null;
    modalViewArea: HTMLDivElement = null;
    modalContentArea: HTMLDivElement = null;
    closeModalBlock: HTMLDivElement = null;

    defaultGalleryBlock: HTMLDivElement = null;
    defaultVideoBlock: HTMLDivElement = null;
    videoBlock: HTMLDivElement = null;
    videoPlayer = null;
    simpleModalPhoto: HTMLImageElement = null;
    defaultGallerySwiper: Swiper = null;

    mode: string = null;

    isInitDefaultContent: boolean = false;
    isActive: boolean = false;
    hasInitData: string = null;
    closeCallback = null;

    defaultTitleBlock: HTMLDivElement = null;
    defaultContentBlock: HTMLDivElement = null;

    constructor() {
        if (!Modal.self) {
            this.modalBlock = <HTMLDivElement>document.getElementById('modal-block');
            if (this.modalBlock) {
                this.modalViewArea = <HTMLDivElement>document.getElementById('modal-view-area');
                this.modalContentArea = <HTMLDivElement>document.getElementById('modal-content-area');
                this.closeModalBlock = <HTMLDivElement>document.getElementById('close-modal-block');
                this.initBaseEventListener();
                Modal.self = this;
                // @ts-ignore
                window.__MODAL = Modal.self;
            }
        }
        return Modal.self;
    }

    initBaseEventListener() {
        this.modalBlock.addEventListener('click', () => this.hiddenModal());
        this.closeModalBlock.addEventListener('click', () => this.hiddenModal());
        this.modalContentArea.addEventListener('click', (e) => e.stopPropagation());
        this.modalViewArea.addEventListener('click', (e) => e.stopPropagation());
        document.addEventListener('keyup', (e) => {
            if (e.code === ESCAPE && this.isActive) {
                this.hiddenModal()
            }
        });
    }

    changeMode(mode) {
        this.modalContentArea.classList.remove(this.mode);
        this.modalBlock.classList.remove(this.mode);
        this.mode = mode;
        if (mode) {
            this.modalContentArea.classList.add(this.mode);
            this.modalBlock.classList.add(this.mode);
        }
    }

    hiddenModal() {
        document.body.style.overflow = 'unset';
        if (this.closeCallback) {
            this.closeCallback();
        }
        if (this.defaultGallerySwiper) {
            this.defaultGallerySwiper.disable();
            this.defaultGallerySwiper.thumbs.swiper.disable();
        }
        this.modalBlock.classList.remove('active');
        this.isActive = false;
    }

    showModal(slide = 0, callBack = null) {
        if (this.defaultGallerySwiper && this.mode === MODALS_MODES.GALLERY) {
            this.defaultGallerySwiper.enable();
            this.defaultGallerySwiper.thumbs.swiper.enable();
            this.defaultGallerySwiper.slideTo(slide, 0);
        }
        this.modalBlock.classList.add('active');
        this.isActive = true;
        document.body.style.overflow = 'hidden';
        if (callBack) {
            callBack();
        }
    }

    // showModalWithHtmlContent(html: string) {
    //     this.clearContent();
    //     this.changeMode(MODALS_MODES.ADD_REVIEW);
    //     this.modalContentArea.innerHTML = html;
    //     this.showModal();
    // }

    showModalWithContentFromJs(func: ((modalBlock: HTMLDivElement, modalContentArea: HTMLDivElement) => void), callBack = null) {
        this.clearContent();
        func(this.modalBlock, this.modalContentArea);
        this.showModal(null, callBack);
    }

    showModalWithSimplePhoto(url: string) {
        if (this.simpleModalPhoto) {
            if (this.simpleModalPhoto.src !== url) {
                this.simpleModalPhoto.src = url;
            }
            this.showModal();
        } else {
            this.clearContent();
            this.simpleModalPhoto = document.createElement('img');
            this.simpleModalPhoto.src = url;
            this.simpleModalPhoto.addEventListener('click', () => this.hiddenModal());
            this.modalContentArea.appendChild(this.simpleModalPhoto);
            this.changeMode(MODALS_MODES.IMAGE);
            this.showModal();
        }
        return this.simpleModalPhoto;
    }

    defaultShowModalWithContentFromJs(title, content) {
        this.clearContent();
        if (!this.isInitDefaultContent) {
            this.defaultTitleBlock = document.createElement("div")
            this.defaultTitleBlock.classList.add('modal-title');
            this.defaultContentBlock = document.createElement("div")
            this.defaultContentBlock.classList.add('modal-content');
            this.modalContentArea.appendChild(this.defaultTitleBlock);
            this.modalContentArea.appendChild(this.defaultContentBlock);
            this.isInitDefaultContent = true;
        }
        this.defaultTitleBlock.innerHTML = title;
        this.defaultContentBlock.innerHTML = content;
        this.showModal();
    }

    clearContent() {
        while (this.modalContentArea.firstChild) {
            this.modalContentArea.firstChild.remove();
        }

        if (this.defaultTitleBlock) {
            this.defaultTitleBlock.remove();
        }

        if (this.defaultContentBlock) {
            this.defaultContentBlock.remove();
        }

        if (this.defaultVideoBlock) {
            this.defaultVideoBlock.remove();
        }

        this.isInitDefaultContent = false;
        this.hasInitData = null;

        if (this.simpleModalPhoto) {
            this.simpleModalPhoto.remove();
        }
        this.changeMode(null);
    }

    // showWithVideo(url) {
    //     this.clearContent();
    //     let result;
    //
    //     this.defaultVideoBlock = this.defaultVideoBlock || document.createElement("div");
    //     this.modalContentArea.appendChild(this.defaultVideoBlock);
    //     if (!this.videoPlayer) {
    //         result = videoPlayerInit(this.defaultVideoBlock, getYoutubeKeyFromUrl(url), (player) => {
    //             this.videoPlayer = player;
    //             this.defaultVideoBlock = this.videoPlayer.h;
    //
    //             this.closeCallback = () => {
    //                 this.videoPlayer.pauseVideo();
    //             };
    //         });
    //
    //     } else {
    //         this.videoPlayer.playVideo();
    //         result = true;
    //         this.closeCallback = () => {
    //             this.videoPlayer.pauseVideo();
    //         };
    //     }
    //     if (result) {
    //         this.changeMode(MODALS_MODES.VIDEO);
    //         this.showModal();
    //     } else {
    //         this.clearContent();
    //     }
    // }

    // changeVideoUrl(url) {
    //     let key = getYoutubeKeyFromUrl(url);
    //     if (key && this.defaultVideoBlock && this.videoPlayer) {
    //         this.videoPlayer.loadVideoById(key);
    //         this.videoPlayer.playVideo();
    //     }
    // }

    updateGallery() {
        // @ts-ignore
        this.defaultGallerySwiper.updateSlides();
    }

    clearGallerySlides() {
        // @ts-ignore
        this.defaultGallerySwiper.removeAllSlides();
        this.defaultGallerySwiper.thumbs.swiper.removeAllSlides();
    }

    addSlide(url: string | string[] | { slider: string[], thumbs: string[] }) {
        if (Array.isArray(url) || typeof url === 'string') {
            this._insertSlide(url);
            this._insertThumbsSlide(url);
        } else {
            this._insertSlide(url.slider);
            this._insertThumbsSlide(url.thumbs);
        }
        this.defaultGallerySwiper.updateSlides();
    }

    changeSlides(url: string | string[] | { slider: string[], thumbs: string[] }) {
        this.clearGallerySlides();
        if (Array.isArray(url) || typeof url === 'string') {
            this._insertSlide(url);
            this._insertThumbsSlide(url);
        } else {
            this._insertSlide(url.slider);
            this._insertThumbsSlide(url.thumbs);
        }
        this.defaultGallerySwiper.updateSlides();
    }

    _insertSlide(url: string | string[]) {
        if (typeof url === "string") {
            this.defaultGallerySwiper.appendSlide(`<div class="swiper-slide"><img src="${url}" alt="" loading="lazy"></div>`);
        } else {
            const slidesHTML = [];
            url.forEach((slideHTML) => {
                slidesHTML.push(`<div class="swiper-slide"><img src="${slideHTML}" alt="" loading="lazy"></div>`);
            });
            this.defaultGallerySwiper.appendSlide(slidesHTML);
        }
    }

    _insertThumbsSlide(url: string | string[]) {
        if (typeof url === "string") {
            this.defaultGallerySwiper.thumbs.swiper.appendSlide(`<img class="swiper-slide-thumbs" src="${url}" alt="" loading="lazy">`);
        } else {
            const slidesHTML = [];
            url.forEach((slideHTML) => {
                slidesHTML.push(`<img class="swiper-slide-thumbs" src="${slideHTML}" alt="" loading="lazy">`);
            });
            this.defaultGallerySwiper.thumbs.swiper.appendSlide(slidesHTML);
        }
    }

    showWithGallery(url: string | string[] | { slider: string[], thumbs: string[] }, startSlide = 0, slidePerView: 'auto' | number = 'auto') {
        this.clearContent();
        this.defaultGalleryBlock = <HTMLDivElement>document.createElement("div");
        this.defaultGalleryBlock.classList.add('modal-gallery');
        this.defaultGalleryBlock.innerHTML = GALLERY_HTML;
        this.modalContentArea.appendChild(this.defaultGalleryBlock);
        this.changeMode(MODALS_MODES.GALLERY);

        // @ts-ignore
        this.defaultGallerySwiper = new Swiper(document.getElementById('modal-gallery'), {
            modules: [Thumbs, Manipulation, Navigation],
            speed: 400,
            slidesPerView: 1 || slidePerView,
            spaceBetween: 10,
            navigation: {
                prevEl: '.swiper-prev-modal',
                nextEl: '.swiper-next-modal'
            },
            lazyPreloaderClass: 'swiper-lazy',
            // lazy: {
            //     loadPrevNext: true,
            //     checkInView: true,
            //     loadPrevNextAmount: 2
            // },
            pagination: {
                el: "#modal-swiper-pagination",
                type: "fraction",
            },
            thumbs: {
                // @ts-ignore
                swiper: new Swiper(document.getElementById('modal-gallery-thumbs'), {
                    modules: [Thumbs, Manipulation, Navigation],
                    spaceBetween: 10,
                    slidesPerView: 2,
                    watchSlidesProgress: true,
                    slideClass: 'swiper-slide-thumbs',
                    // lazy: {
                    //     loadPrevNext: true,
                    //     checkInView: true,
                    //     loadPrevNextAmount: 1
                    // },
                    navigation: {
                        prevEl: '.swiper-prev-modal-thumbs',
                        nextEl: '.swiper-next-modal-thumbs'
                    },
                    breakpoints: {
                        420: {
                            slidesPerView: 3
                        },
                        600: {
                            slidesPerView: 4
                        },
                        700: {
                            slidesPerView: 5
                        },
                        800: {
                            slidesPerView: 6
                        },
                        1100: {
                            slidesPerView: 7
                        },
                        1440: {
                            slidesPerView: 10
                        }
                    }
                })
            }
        });
        this.changeSlides(url);
        this.showModal(startSlide);
    }
}

export const queryParameters = () => {
    const regex = new RegExp('[?&](?<key>[\\w\\\\d\\-_\\]\\[]+)=(?<value>[\\w\\dа-яёЁА-Я/\\s,%.+\\-\ _]+)', 'mgui');
    const results = regex[Symbol.matchAll](decodeURI(location.href));
    let result = {};
    let next = results.next();
    let done = next.done;

    while (results && !done) {
        if (!done && next.value) {
            let a = next.value.groups;
            result[a.key] = a.value;
        }
        next = results.next();
        done = next.done;
    }
    return result;
}

