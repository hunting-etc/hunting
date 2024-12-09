import dayjs from "dayjs";
import { IRangeOptions } from "../interfaces/range.interface";
import { calendar } from "./calendar";
import CalendarConnector from "./connector";

class DateDreamerRange implements IRangeOptions {
    calendar1: calendar | undefined;
    calendar2: calendar | undefined;
    calendar1DisplayedDate: Date = new Date();
    calendar2DisplayedDate: Date = new Date();

    element: HTMLElement;
    theme?: "default" | undefined;
    styles?: string | undefined;
    format?: string | undefined;
    iconPrev?: string | undefined;
    iconNext?: string | undefined;
    onChange?: ((event: CustomEvent<any>) => void) | undefined;
    onRender?: ((event: CustomEvent<any>) => void) | undefined;

    selectedStartDate: Date | undefined;
    selectedEndDate: Date | undefined;

    connector: CalendarConnector | undefined;

    constructor(options: IRangeOptions) {
        this.element = options.element;
        this.connector = new CalendarConnector();

        this.styles = options.styles;
        this.format = options.format;
        this.iconPrev = options.iconPrev;
        this.iconNext = options.iconNext;
        this.onChange = options.onChange;
        this.onRender = options.onRender;
        this.theme = options.theme;

        if(this.connector) {
            this.connector.dateChangedCallback = this.handleDateChange;
        }

        this.init();
    }
    
    /**
     * Initialize parent div element and inject both calendars.
     */
    init():void {
        this.calendar1DisplayedDate.setDate(1);
        const calendar1WrapElement = document.createElement("div");

        this.calendar1 = new calendar({
            element: calendar1WrapElement,
            theme: this.theme,
            format: this.format,
            hideInputs: true,
            hideNextNav: false,
            iconPrev: this.iconPrev,
            rangeMode: true,
            hideOtherMonthDays: false,
            connector: this.connector,
        });
        this.element.append(calendar1WrapElement);
    }
    // @ts-ignore

    handleDateChange = (e: CustomEvent) => {
        if(this.onChange) {
            const customEvent = new CustomEvent("onChange",{
                detail: {
                    startDate: this.connector?.startDate ? dayjs(this.connector?.startDate).format(this.format) : null,
                    endDate: this.connector?.endDate ? dayjs(this.connector?.endDate).format(this.format) : null
                }
            })
            this.onChange(customEvent);
        }
    }
}

export {DateDreamerRange as range}