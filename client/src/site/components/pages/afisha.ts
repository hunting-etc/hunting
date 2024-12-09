import {Dropdown} from "../dropdown";
import {queryParameters} from "../utils";
import {RangeDatePickerController} from "../datepicker";
  
export function callAfishaPagination(tag: HTMLDivElement | Document = document) {
    tag.querySelectorAll('.pagination-afisha-a__item').forEach((element) => {
        element.addEventListener('click', () => {
            const query_name = (<HTMLInputElement>document.getElementById('search'))?.value;

            const page_num = element.getAttribute('data-page-num');
            const venue = element.getAttribute('data-venue');
            const category = element.getAttribute('data-category');
            const start_date = element.getAttribute('data-start-date');
            const end_date = element.getAttribute('data-end-date');

            getAfishaPaginationData(query_name, page_num, venue, category, start_date, end_date);
        });
    });
}

export function callBuyTicket(tag: HTMLDivElement | Document = document) {
    tag.querySelectorAll('.poster-button').forEach((element) => {
        element.addEventListener('click', (event) => {
            const saleLink = element.getAttribute('data-link');
            if (saleLink) {
                event.preventDefault();
                event.stopPropagation();
                window.open(saleLink);
            }
        });
    });
}

function getAfishaPaginationData(query_name, page_num, venue_name, category_name, startDate, endDate) {
    const name = query_name ? `search=${query_name}&` : '';
    const venue = venue_name ? `&venue=${venue_name}` : '';
    const category = category_name ? `&category=${category_name}` : '';
    const date = startDate && endDate ? `&date=${startDate}/${endDate}` : '';

    const uri = `fetch/data?${name}page=${page_num}${venue}${category}${date}`;
    const encoded = encodeURI(uri);

    fetch(encoded).then((response) => {
        return response.text();
    }).then((data) => {
        const block = <HTMLDivElement>document.querySelector('.main-page__content');
        block.innerHTML = data;
        callAfishaPagination(block);
        callBuyTicket(block);
        window.scrollTo(0, 0);
        history.pushState({}, null, `?${name}page=${page_num}${venue}${category}${date}`);
    });
}

export function initAfishaFilter() {
    const searchInput = <HTMLInputElement>document.getElementById('search');
    const dateInput = <HTMLInputElement>document.getElementById('datepicker');
    const dropdown = Dropdown;

    function onAfishaFilterChange() {
        const pageNum = 1;
        const {value: queryName} = searchInput;
        const category = dropdown.namedDropdowns['category-filter'].selectedOption ? dropdown.namedDropdowns['category-filter'].selectedOption.value : null;
        const venue = dropdown.namedDropdowns['venue-filter'].selectedOption ? dropdown.namedDropdowns['venue-filter'].selectedOption.value : null;
        const [startDate, endDate] = getDates();
        getAfishaPaginationData(queryName, pageNum, venue, category, startDate, endDate);
    }

    let datedreamerCalendar = <HTMLElement>document.querySelector('.datepicker-block div.datepicker');
    let queryParameter = <Record<string, any>>queryParameters();
    let dateClearButton = <HTMLElement>document.querySelector('.btn-clear-datetime');

    if (dateInput && datedreamerCalendar && dateClearButton) {
        dateInput.addEventListener('click', () => {
            datedreamerCalendar.classList.toggle('show');
            if (datedreamerCalendar.classList.contains('show')) {
                setTimeout(() => {
                    document.addEventListener('click', clickOutside, {once: true})
                }, 100);
            } else {
                document.removeEventListener('click', clickOutside)
            }
        });
        const icon = document.querySelector('.datepicker-block .datapicker-icon')
        if (icon) {
            icon.addEventListener('click', () => {
                datedreamerCalendar.classList.toggle('show');
                if (datedreamerCalendar.classList.contains('show')) {
                    setTimeout(() => {
                        document.addEventListener('click', clickOutside, {once: true});
                    }, 100);
                } else {
                    document.removeEventListener('click', clickOutside);
                }
            });
        }
        const clickOutside = (e) => {
            const dC = <HTMLElement>document.querySelector('.datepicker-block div.datepicker');
            if (e.target !== dC && !dC.contains(e.target)) {
                if (dC.classList.contains('show')) {
                    dC.classList.remove('show');
                }
            }
        };

        let calendarController = null;
        let dates = null;
        if (queryParameter['date']) {
            dates = <{ startDate: Date, endDate: Date }>RangeDatePickerController.getDatesFromQuery(queryParameter['date']);
        }
        calendarController = new RangeDatePickerController(null, datedreamerCalendar, {
            onChange: (dateEvent) => {
                dateInput.value = (dateEvent.detail.startDate && dateEvent.detail.endDate) ? `${dateEvent.detail.startDate} — ${dateEvent.detail.endDate}` : '';
                datedreamerCalendar.classList.remove('show');
                document.removeEventListener('click', clickOutside)
                dateClearButton.style.display = 'block';
                onAfishaFilterChange();
            }
        }, dates)
  
        dateClearButton.addEventListener('click', () => {
            if (dateInput.value != '') {
                calendarController.clearDates();
                dateClearButton.style.display = 'none';
            }
        });

        // @ts-ignore
        window.__calendarController = calendarController;
    }

    function getDates() {
        const formattedDates = dateInput.value.split(' — ');
        const [startDate, endDate = startDate] = formattedDates.map(date => date.split('-').reverse().join('-'));

        return [startDate, endDate];
    }

    searchInput?.addEventListener('input', onAfishaFilterChange);
    // dateInput?.addEventListener('close', onAfishaFilterChange);

    const categoryClearButton = <HTMLElement>document.querySelector('.clear-category');
    const categoryFilterDropdown = dropdown.namedDropdowns['category-filter'];
    if (categoryFilterDropdown && categoryClearButton) {

        const categoryDropdownFilter = dropdown.namedDropdowns['category-filter'];
        categoryDropdownFilter.callBack = onAfishaFilterChange

        const value = queryParameter['category'];
        if (value) {
            categoryFilterDropdown.selectOptionByValue(value);
        }

        categoryClearButton.addEventListener('click', () => {
            if (categoryDropdownFilter.selectedOption) {
                categoryDropdownFilter.onSelectOption(categoryDropdownFilter.selectedOption)
            }
        })

    }

    const venueClearButton = <HTMLElement>document.querySelector('.clear-venue');
    const venueFilterDropdown = dropdown.namedDropdowns['venue-filter'];
    if (venueFilterDropdown && venueClearButton) {

        const venueFilterDropdown = dropdown.namedDropdowns['venue-filter'];
        venueFilterDropdown.callBack = onAfishaFilterChange;

        const value = queryParameter['venue'];
        if (value) {
            venueFilterDropdown.selectOptionByValue(value);
        }

        venueClearButton.addEventListener('click', () => {
            if (venueFilterDropdown.selectedOption) {
                venueFilterDropdown.onSelectOption(venueFilterDropdown.selectedOption);
            }
        });

    }
}
