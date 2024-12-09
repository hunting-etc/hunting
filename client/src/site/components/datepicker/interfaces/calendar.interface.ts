import CalendarConnector from "../components/connector";

export interface ICalendarOptions {
    element?: HTMLElement| undefined,
    selectedDate?: string | Date | undefined,
    theme?: "default" | undefined,
    styles?: string | undefined,
    format?: string | undefined,
    iconPrev?: string | undefined,
    iconNext?: string | undefined,
    hidePrevNav?: boolean | undefined,
    hideNextNav?: boolean | undefined,
    inputLabel?: string | undefined,
    inputPlaceholder?: string | undefined,
    externalInput?: HTMLInputElement | undefined,
    hideInputs?: boolean | undefined,
    hideOtherMonthDays?: boolean | undefined,
    rangeMode?: boolean | undefined,
    connector?: CalendarConnector | undefined;
    onChange?: ((event: CustomEvent) => void) | undefined,
    onRender?: ((event: CustomEvent) => void) | undefined,
    onNextNav?: ((event: CustomEvent) => void) | undefined,
    onPrevNav?: ((event: CustomEvent) => void) | undefined
}