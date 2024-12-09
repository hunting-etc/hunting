import '@/site/styles/index.scss';
import initPages from "@/site/components/pages/index";
import initSwipers from "@/common/components/swiper";
import initBurger from "@/common/components/burger";
import dropdown from "@/site/components/dropdown";
import initFigure from "@/site/components/pages/figure";
import {callTag} from "@/site/components/tag";
import {callEmoji} from "@/site/components/emoji";
import hoverPictures from "@/market/components/product-service-item";
import initTranslate from "@/common/components/translation";
import initBlindMode from "@/common/components/blind-mode";

initBlindMode();
dropdown();
initPages();
initSwipers();
initBurger();
initFigure();
callTag();
callEmoji();
hoverPictures();
initTranslate();

