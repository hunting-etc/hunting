import {calendar as Calendar} from "./datepicker/components/calendar";
import {range as RangeCalendar} from "./datepicker/components/range";
import {ICalendarOptions} from "@/site/components/datepicker/interfaces/calendar.interface";

export class RangeDatePickerController {
    calendarConstructor = RangeCalendar;//calendar | range  | calendarToggle
    calendar: RangeCalendar;
    initDates: { startDate: Date, endDate: Date };

    constructor(calendar: RangeCalendar, calendarTag: HTMLElement = null, options: ICalendarOptions = <ICalendarOptions>{}, dates: { startDate: Date, endDate: Date } | null = null) {
        if (calendar) {
            this.calendar = calendar;
        } else {
            this.defaultInit(calendarTag, <ICalendarOptions>options);
        }
        this.initDates = dates;

        if (this.initDates) {
            this.setDates(this.initDates);
        }
    }

    defaultInit(datedreamerCalendar: HTMLElement, options: ICalendarOptions) {
        // @ts-ignore
        this.calendar = new this.calendarConstructor({
            element: datedreamerCalendar,
            // select date on init
            selectedDate: null,
            // date format
            format: "DD-MM-YYYY",
            // custom next/prev icons
            iconNext: '',
            iconPrev: '',
            // set the label of the date input
            inputLabel: 'Set a date',
            // set the placeholder of the date input
            inputPlaceholder: 'Enter a date',
            // hide the input and today button
            hideInputs: false,
            // enable dark mode
            theme: 'default',
            // custom styles here
            styles: '',
            //     `
            //   button {
            //     color: black;
            //   }
            // `
            // callback
            // onChange: onChange
            // onRender: (e) => {
            //   console.log(e.detail.calendar);
            // }
            ...options
        })
    }

    setDates(dates: { startDate: Date, endDate: Date }) {
        this.setStartDate(dates.startDate, false);
        this.setEndDate(dates.endDate, false);
        this.callChange();
    }

    clearDates() {
        this.calendar.connector.startDate = null;
        this.calendar.connector.calendars[0].displayedMonthDate = new Date();
        this.calendar.connector.endDate = null;
        this.callChange();
    }

    setStartDate(date, callChange: boolean = true) {
        // @ts-ignore
        this.calendar.connector.startDate = new Date(date.getTime());
        this.calendar.connector.calendars[0].displayedMonthDate = new Date(date.getTime());
        if (callChange) {
            this.callChange();
        }
    }

    setEndDate(date, callChange: boolean = true) {
        // @ts-ignore
        this.calendar.connector.endDate = new Date(date.getTime());
        if (callChange) {
            this.callChange();
        }
    }

    callChange() {
        this.calendar.connector.rebuildAllCalendars();
        // @ts-ignore
        this.calendar.connector.dateChangedCallback();
    }

    static getDatesFromQuery(dateString: string) {
        const reg = new RegExp("(?<sYear>\\d{4})-(?<sMonth>\\d{2})-(?<sDay>\\d{2})/(?<eYear>\\d{4})-(?<eMonth>\\d{2})-(?<eDay>\\d{2})")
        let startDate = null;
        let endDate = null;
        if (dateString) {
            const result = dateString.match(reg);
            if (result) {
                let {sYear, sMonth, sDay, eYear, eMonth, eDay} = result.groups;
                startDate = new Date(Number(sYear), Number(sMonth) - 1, Number(sDay));
                endDate = new Date(Number(eYear), Number(eMonth) - 1, Number(eDay));

                if (endDate - startDate < 0) {
                    let temp = startDate;
                    startDate = endDate;
                    endDate = temp;
                }

            } else {
                startDate = new Date();
                endDate = new Date();
            }
        }

        return {
            startDate,
            endDate
        }
    }
}

export class DatePickerController {

    calendarConstructor = Calendar;//calendar | range  | calendarToggle
    calendar: Calendar;
    initDate: Date;

    constructor(calendar: Calendar, calendarTag: HTMLElement = null, options: ICalendarOptions = <ICalendarOptions>{}, date: Date | null = null) {
        if (calendar) {
            this.calendar = calendar;
        } else {
            this.defaultInit(calendarTag, <ICalendarOptions>options);
        }
        this.initDate = date;

        if (this.initDate) {
            this.setDate(this.initDate);
        }
    }

    defaultInit(datedreamerCalendar: HTMLElement, options: ICalendarOptions) {
        // @ts-ignore
        this.calendar = new this.calendarConstructor({
            element: datedreamerCalendar,
            // select date on init
            selectedDate: null,
            // date format
            format: "DD-MM-YYYY",
            // custom next/prev icons
            iconNext: '',
            iconPrev: '',
            // set the label of the date input
            inputLabel: 'Выберите дату ыв',
            // set the placeholder of the date input
            inputPlaceholder: 'Выберите дату',
            // hide the input and today button
            hideInputs: true,
            // enable dark mode

            theme: 'default',
            // custom styles here
            styles: '',
            //     `
            //   button {
            //     color: black;
            //   }
            // `
            // callback
            // onChange: onChange
            // onRender: (e) => {
            //   console.log(e.detail.calendar);
            // }
            ...(options ? options : {})
        })
    }

    setDate(date: Date, callChange: boolean = true) {
        // @ts-ignore
        this.calendar.selectedDate = new Date(date.getTime());
        this.calendar.rebuildCalendar()

        if (callChange) {
            this.callChange();
        }
    }

    callChange() {
        // @ts-ignore
        this.calendar.connector.dateChangedCallback();
    }
}
