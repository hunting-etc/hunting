export function callResultGroupPagination(tag: HTMLDivElement | Document = document) {
    tag.querySelectorAll(".pagination-block-a__item").forEach((element: HTMLHRElement) => {
        element.addEventListener("click", () => {
            const page_num = element.getAttribute('data-page-num');
            getResultGroupPaginationData(page_num)
        });
    });
}

function getResultGroupPaginationData(page_num) {
    const url = new URL(window.location.href);
    const slug = url.pathname.split('/').pop();

    fetch(`fetch/data/${slug}?page=${page_num}`).then((response) => {
        return response.text();
    }).then((data) => {
        const block = <HTMLDivElement>document.querySelector('.group-items-container')
        if (block) {
            block.innerHTML = data
            callResultGroupPagination(block)
            window.scrollTo(0, 0);
        }
    });
    history.pushState({}, null, `?page=${page_num}`);
}

