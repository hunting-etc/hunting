export function callSearchResultPagination(tag:HTMLDivElement|Document = document) {
    tag.querySelectorAll(".search-pagination-block-a__item").forEach((element: HTMLHRElement) => {
        element.addEventListener("click", () => {
            const page_num = element.getAttribute('data-page-num');
            getSearchResultPaginationData(page_num)
        });
    });
}

function getSearchResultPaginationData(page_num) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let extra = urlParams.has('q') ? `&q=${urlParams.get('q')}` : ''

    fetch(`fetch/data?page=${page_num}${extra}`).then((response) => {
        return response.text();
    }).then((data) => {
        const block = <HTMLDivElement>document.querySelector('.items-container')
        block.innerHTML = data
        callSearchResultPagination(block)
        window.scrollTo(0, 0);
    });
    history.pushState({}, null, `?page=${page_num}${extra}`);
}

