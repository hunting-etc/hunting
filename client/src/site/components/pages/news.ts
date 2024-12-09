import initBlockContent from '../blocks-content';
import Swiper, {Navigation} from "swiper";
import {gradientUtils} from "../utils";

export function initNewsPage() {
    initBlockContent();
    const NEWS_BLOCK_NAVIGATION_ITEMS = document.querySelectorAll('.news-block-navigation__item');
    const SHOW_MORE_BTN = document.getElementById('news-block__button');
    const GROUP_NAMES: { [key: string]: string } = {
        // TODO DELETE (USE META in TAG)
        'all_news': 'Вcе новости',
        'concerti': 'Новости по концертам',
        'gastroli': 'Новости по гастролям',
        'festivali': 'Новости по фестивалям',
        'spektakli': 'Новости по спектаклям',
        'oficialno': 'Официальные новости',
    };
    const ELEMENTS_TO_SHOW = 2;

    function clearNavigationSelectItem() {
        if (NEWS_BLOCK_NAVIGATION_ITEMS) {
            NEWS_BLOCK_NAVIGATION_ITEMS.forEach(item => item.classList.remove('news-block-navigation__selected_item'));
        }
    }

    function changeSelectableItem() {
        clearNavigationSelectItem();
        if (GROUP_NAMES.hasOwnProperty(this.id)) {
            let groupName = GROUP_NAMES[this.id];
            document.title = `${groupName}`;
            this.classList.toggle('news-block-navigation__selected_item');
        } else {
            document.getElementById('all_news')?.classList.toggle('news-block-navigation__selected_item');
            document.title = 'Новости о мероприятиях, фестивалях, коллективах и артистах'
        }
        getNewsPaginationData(1, this.id);
    }

    function setNavigationSelectItem() {
        let group_name = window.location.pathname.split('/').pop();
        if (!GROUP_NAMES.hasOwnProperty(group_name)) {
            group_name = 'all_news'
        }
        document.getElementById(group_name)?.classList.toggle('news-block-navigation__selected_item');
    }


    function toggleNewsItems(showMore) {
        const newsItems = <HTMLHRElement[]><unknown>document.querySelectorAll('.pinned-news__block > a.news_item');
        for (let i = ELEMENTS_TO_SHOW; i < newsItems.length; i++) {
            newsItems[i].style.display = showMore ? 'block' : 'none';
        }
        if (SHOW_MORE_BTN) {
            SHOW_MORE_BTN.innerHTML = showMore ? 'Свернуть' : 'Показать ещё';
        }
    }


    window.addEventListener('load', setNavigationSelectItem);
    if (NEWS_BLOCK_NAVIGATION_ITEMS) {
        NEWS_BLOCK_NAVIGATION_ITEMS.forEach(item => item.addEventListener('click', changeSelectableItem));
    }
    if (SHOW_MORE_BTN) {
        SHOW_MORE_BTN.addEventListener('click', function () {
            toggleNewsItems(SHOW_MORE_BTN.innerHTML === 'Показать ещё');
        });
    }
}

export function callNewsPagination(tag: HTMLDivElement | Document = document) {
    tag.querySelectorAll(".pagination-news-a__item").forEach((element) => {
        element.addEventListener("click", () => {
            const group_name = element.getAttribute('data-group-name');
            const page_num = element.getAttribute('data-page-num');

            if (group_name) {
                getNewsPaginationData(page_num, group_name)
            }
        });
    });
}

function getNewsPaginationData(page_num, group_name) {
    fetch(`fetch/data?page=${page_num}&group=${group_name}`).then((response) => {
        return response.text();
    }).then((data) => {
        const block = <HTMLDivElement>document.querySelector('.pinned-news__pagination-block__items')
        block.innerHTML = data
        callNewsPagination(block)
        window.scrollTo(0, 0);
    });
    history.pushState({}, null, `${group_name}?page=${page_num}`);
}

export function initNewsSwiper() {
    if (document.querySelector('.most-popular-by-week__items')) {
        const swiperNewsGradient = <HTMLDivElement>document.querySelector('.most-popular-by-week__items .shadow-gradient')
        new Swiper(".most-popular-by-week__items", {
            modules: [Navigation],
            slidesPerView: 'auto',
            spaceBetween: 6,
            navigation: {
                nextEl: ".bb-r",
                prevEl: ".bb-l",
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
