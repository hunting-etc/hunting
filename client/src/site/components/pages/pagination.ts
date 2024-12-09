import Modal from "@/site/components/utils";

export function callResultPagination(tag: HTMLDivElement | Document = document) {
    tag.querySelectorAll(".pagination-block-a__item").forEach((element: HTMLHRElement) => {
        element.addEventListener("click", () => {
            const page_num = element.getAttribute('data-page-num');
            getResultPaginationData(page_num)
        });
    });
}

function getResultPaginationData(page_num) {
    fetch(`fetch/data?page=${page_num}`).then((response) => {
        return response.text();
    }).then((data) => {
        const block = <HTMLDivElement>document.querySelector('.items-container')
        if (block) {
            block.innerHTML = data
            callResultPagination(block)
            window.scrollTo(0, 0);
        }
    });
    history.pushState({}, null, `?page=${page_num}`);
}

export function itemPageOpenModal() {
    const modal = new Modal();

    const open_modal = <HTMLDivElement>document.getElementById("open-modal");
    const imgTag = <HTMLImageElement>document.querySelector(".item-page__block__content__image-block__image img");
    if (open_modal && imgTag) {
        open_modal.addEventListener('click', () => {
            modal.showModalWithSimplePhoto(imgTag.src);
        });
    }
}
