import JSCookie from "@/common/utils/cookie";

const KEY_NAME = 'emoji';
const KEY_SEPARATOR = '-';


function updateEmojiClasses(emojiItems, targetItem, selectedClass, unselectedClass) {
    emojiItems.forEach((item) => {
        item.classList.remove(selectedClass);
        item.classList.add(unselectedClass);
    });

    targetItem.classList.remove(unselectedClass);
    targetItem.classList.add(selectedClass);
}

function initializeSelectedEmoji(emojiItems, selectedEmojiId) {
    const selected_element = document.querySelector(`[data-id="emoji-${selectedEmojiId}"]`);
    if (selected_element) {
        updateEmojiClasses(emojiItems, selected_element, 'selected-emoji', 'unselected-emoji');
    }
}

async function updateEmojiViews(currentPage, selectedEmojiId) {
    const path = new URL(currentPage).pathname;
    const pageKey = path.split("/")[1];

    try {
        const response = await fetch('/api/update-emoji-views/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': JSCookie.get('csrftoken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentPage: pageKey,
                selectedEmojiId: String(selectedEmojiId),
            })
        });
        if (!response.ok) {
            throw new Error('Failed to update emoji views.');
        }
    } catch (error) {
    }
}

function addEmojiClickListener(item, emojiItems, selectedEmojiKey, currentPage) {
    const clickHandler = () => {
        if (!item.classList.contains('selected-emoji')) {
            updateEmojiClasses(emojiItems, item, 'selected-emoji', 'unselected-emoji');

            const selectedEmojiId = item.dataset.id.substring(KEY_NAME.length + KEY_SEPARATOR.length);
            localStorage.setItem(selectedEmojiKey, selectedEmojiId);

            removeAllClickListeners(emojiItems);

            updateEmojiViews(currentPage, selectedEmojiId).then(() => {
                let emojiCount = document.querySelector(`[data-id="emoji-count-${selectedEmojiId}"]`);
                if (emojiCount) {
                    const num: number = parseInt(emojiCount.textContent, 10);
                    if (!isNaN(num)) {
                        emojiCount.textContent = String(num + 1);
                    }
                }
            }).catch((error) => {
                console.log(error)
            });

            item.removeEventListener('click', clickHandler);
        }
    };
    item.addEventListener('click', clickHandler);
    item._clickHandler = clickHandler;
}

function removeAllClickListeners(emojiItems) {
    emojiItems.forEach((item) => {
        item.removeEventListener('click', item._clickHandler);
        item._clickHandler = null;
    });
}

export function callEmoji() {
    const emojiContainer = document.querySelector('.emoji-block');

    if (emojiContainer) {
        const emojiItems = Array.from(emojiContainer.querySelectorAll('.emoji'));
        const currentPage = window.location.href;
        const selectedEmojiKey = `${currentPage}-selected-emoji`;
        let selectedEmojiId = localStorage.getItem(selectedEmojiKey);

        if (selectedEmojiId && document.querySelector(`[data-id="emoji-${selectedEmojiId}"]`)) {
            initializeSelectedEmoji(emojiItems, selectedEmojiId);
        } else {
            selectedEmojiId = null;
            emojiItems.forEach((item) => addEmojiClickListener(item, emojiItems, selectedEmojiKey, currentPage));
        }
    }
}
