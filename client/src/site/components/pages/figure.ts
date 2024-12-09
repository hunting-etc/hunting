export default function initFigure() {
    const showMore = <HTMLElement>document.getElementById("awards-container");
    const button = <HTMLElement>document.getElementById("award-show-more__button");

    if (showMore && button) {
        button.addEventListener("click", function () {
            showMore.classList.toggle("open");
            button.textContent = this.textContent == 'Скрыть' ? 'Показать ещё...' : 'Скрыть';
        });
    }
}