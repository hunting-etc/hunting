export function callTag(tag: HTMLDivElement | Document = document) {
    tag.querySelectorAll('.news-block__item_tag').forEach((element) => {
        element.addEventListener('click', (event) => {
            const saleLink = element.getAttribute('data-link');
            if (saleLink) {
                event.preventDefault();
                event.stopPropagation();
                window.open(saleLink, "_self");
            }
        });
    });
}