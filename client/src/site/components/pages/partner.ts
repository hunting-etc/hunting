import Swiper, {Navigation} from "swiper";
import {gradientUtils} from "@/site/components/utils";

export function initNewsPartnerSwiper(){
    if (document.querySelector('.partner-news')) {
        const swiperNewsGradient = <HTMLDivElement>document.querySelector('.partner-news .shadow-gradient')
        new Swiper(".partner-news", {
            modules:[Navigation],
            slidesPerView: 'auto',
            spaceBetween: 6,
            navigation: {
                nextEl: ".nb-r",
                prevEl: ".nb-l",
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