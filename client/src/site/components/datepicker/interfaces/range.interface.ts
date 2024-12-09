export interface IRangeOptions {
    element: HTMLElement,
    selectedDate?: string | Date | undefined,
    theme?: "default" | undefined,
    styles?: string | undefined,
    format?: string | undefined,
    iconPrev?: string | undefined,
    iconNext?: string | undefined,
    inputLabel?: string | undefined,
    inputPlaceholder?: string | undefined,
    hideInputs?: boolean | undefined,
    onChange?: ((event: CustomEvent) => void) | undefined,
    onRender?: ((event: CustomEvent) => void) | undefined
    
}