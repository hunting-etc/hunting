export const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
   "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

export const theme = ["default"];

export const leftChevron = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>`;
export const rightChevron = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`;

/**
 * The HTML for the calendar element.
 */
export function calendarRoot(theme: string):string {
  return `
  <div class="datedreamer__calendar ${theme ? theme: ""}">
      <div class="datedreamer__calendar_header"></div>
  
      <div class="datedreamer__calendar_inputs"></div>
      <div class="datedreamer__calendar_errors"></div>
  
      <div class="datedreamer__calendar_days-wrap">
          <div class="datedreamer__calendar_days-header">
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Пн</div>
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Вт</div>
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Ср</div>
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Чт</div>
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Пт</div>
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Сб</div>
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Вс</div>
          </div>
  
          <div class="datedreamer__calendar_days"></div>
      </div>
  </div>
  `
}
