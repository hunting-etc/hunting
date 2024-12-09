import {festivalsPageOpenModal} from '../pages/festivals';
import initFigure from "../pages/figure";
import {callResultPagination, itemPageOpenModal} from "../pages/pagination";
import {initNewsPage, callNewsPagination, initNewsSwiper} from "../pages/news";
import {callBandPagination, initBandFilter, initBandPage, initBandSwipers} from "../pages/band";
import {callAfishaPagination, callBuyTicket, initAfishaFilter} from "../pages/afisha";
import {initNewsPartnerSwiper} from "../pages/partner";
import {initNewsEventSwiper, initMemberEventSwiper, initYandexMap} from "../pages/event";
import {callResultGroupPagination} from "../pages/group";
import {callSearchResultPagination} from "../pages/search";


window.scrollTo(0, 0);

export default () => {
// Modals
    itemPageOpenModal();
    festivalsPageOpenModal();

// Pages init
    initNewsPage();
    initFigure();
    initBandPage();
    initBandSwipers();
    callBuyTicket();
    initNewsSwiper();
    initNewsPartnerSwiper();
    initNewsEventSwiper();
    initMemberEventSwiper();

// Filters
    initBandFilter();
    initAfishaFilter();

// Paginations
    callNewsPagination();
    callResultPagination();
    callBandPagination();
    callAfishaPagination();
    callResultGroupPagination();
    callSearchResultPagination();

// Utils
    initYandexMap();
} 