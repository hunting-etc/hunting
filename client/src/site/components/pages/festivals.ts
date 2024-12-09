import Modal, {MODALS_MODES} from "../utils";

export function festivalsPageOpenModal() {
    const modal = new Modal();
    document.querySelectorAll('.project-block__pictures').forEach((item) => {
        const mainBlock = item.querySelector('.project-block__pictures__main-picture')
        mainBlock.addEventListener('click', () => {
            const imgs = [];
            const mainImg = mainBlock.querySelector('img');

            if (mainImg) {
                imgs.push(mainImg.dataset.src);
            }

            item.querySelectorAll('.project-block__pictures__other img').forEach((imgTag:HTMLImageElement) => {
                imgs.push(imgTag.dataset.src);
            });

            if (modal.mode === MODALS_MODES.GALLERY) {
                modal.changeSlides({
                    slider: imgs || [],
                    thumbs: imgs || []
                })
                modal.showModal();
            } else {
                modal.showWithGallery({
                    slider: imgs || [],
                    thumbs: imgs || []
                })
            }
        })
    });
}