const A_TAG_NODE_NAME = 'A';

const EVENT = {
    'CLICK': 'click',
    'MOUSEENTER': 'mouseenter',
    'MOUSELEAVE': 'mouseleave'
}

/*
<div class="dropdown">
    Если нужно выбираемое добавить класс "selectable".
    "form-dropdown"  Добавит <input> для формы, в нутрь <div class="dropdown-option">.
    "search" Добавит над выподающим списком строку ввода, по которой будут фильтроваться "dropdown-option".
    Если нужен мультивыбор добавте аттрибут "multiple"
    Если нужен может быть пустым добавте class "nullable"

    <div class="dropdown-title"></div> Если внутри "dropdown-title" будет тэг '<a>' то клик  будет работать на переход по ссылке, а не на открытие.
    <div class="dropdown-options">
        <div class="dropdown-option selected"></div>
        <div class="dropdown-option"></div>
        <div class="dropdown-option"></div>
        <div class="dropdown-option"></div>
    </div>
</div>


*/
export class Option {
    self: HTMLElement = null;
    index: number = null;
    value = null;
    text: string = null;
    selected: boolean = false;
    parent: Dropdown = null;
    inputTag: HTMLInputElement = null;

    constructor(tag: HTMLDivElement, parentDropdown: Dropdown, index: number) {
        this.self = tag;
        this.index = index;
        this.value = tag.getAttribute('value');
        this.text = tag.textContent;
        this.selected = !!tag.classList.contains('selected');
        this.parent = parentDropdown;

        this.self.addEventListener('click', (e) => this.onClick(e), { capture: true });
        if (parentDropdown.isForForm) {
            this.inputTag = this.createInputTag(tag, parentDropdown.self.getAttribute('name'), this.value, this.selected);
        }
    }

    createInputTag(tag: HTMLDivElement, name, value, selected: boolean) {
        let input = <HTMLInputElement>document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', name);
        input.setAttribute('value', value);
        if (!selected) {
            input.disabled = true;
        }
        tag.appendChild(input);
        return input;
    }

    select(needDispatchEvent = false) {
        this.self.classList.add('selected');
        this.selected = true;
        if (this.parent.isForForm) {
            this.inputTag.disabled = false;
            if (needDispatchEvent) {
                this.inputTag.dispatchEvent(new Event('change'));
            }
        }
    }

    deselect(needDispatchEvent = false) {
        this.self.classList.remove('selected');
        this.selected = false;
        if (this.parent.isForForm) {
            this.inputTag.disabled = true;
            if (needDispatchEvent) {
                this.inputTag.dispatchEvent(new Event('change'));
            }
        }
    }

    hidden() {
        this.self.classList.add('hidden');
    }

    show() {
        this.self.classList.remove('hidden');
    }

    onClick(e) {
        e.stopPropagation();
        this.parent.onSelectOption(this);
    }
}

export class Dropdown {
    static dropdowns: Dropdown[] = [];
    static namedDropdowns: Record<string, Dropdown> = {};
    static waitDropdown: Record<string, ((self: Dropdown) => void)> = {};
    static activeDropdown: Dropdown = null;

    callBack = null;
    isActive: boolean = false;
    isMultiple: boolean = false;
    isForForm: boolean = false;
    isSelectable: boolean = false;
    hasSearch: boolean = false;
    nullable: boolean = false;
    options: Option[] = [];
    optionsTag: HTMLElement = null;
    self: HTMLElement = null;
    mouseLeaveArea: HTMLElement = null;
    eventType: string = null;
    selectedOption: Option = null;
    selectedOptions: Option[] = [];
    titleDefault: string = 'Выберите';
    titleTag: HTMLElement = null;
    events: Record<string, ((value: any) => void)[]> = {};

    constructor(tag: HTMLElement, name: string = null) {
        this.self = tag;
        this.titleTag = <HTMLElement>this.self.querySelector('.dropdown-title');
        this.optionsTag = <HTMLElement>this.self.querySelector('.dropdown-options');
        this.isMultiple = Boolean(tag.attributes.getNamedItem('multiple'));
        this.nullable = Boolean(tag.classList.contains('nullable'));
        this.hasSearch = Boolean(tag.classList.contains('search'));
        this.eventType = tag.classList.contains('hover-event') ? EVENT.MOUSEENTER : EVENT.CLICK;
        this.mouseLeaveArea = document.getElementById(this.self.dataset.parentId);
        this.self.addEventListener(this.eventType, (e) => this.onClickDropdown(e));
        (this.mouseLeaveArea || this.self).addEventListener(EVENT.MOUSELEAVE, () => this.onMouseLeave());
        this.titleDefault = this.titleTag.textContent;
        this.isForForm = tag.classList.contains('form-dropdown');
        this.isSelectable = tag.classList.contains('selectable');
        if (this.isSelectable) {
            this.self.querySelectorAll('.dropdown-options .dropdown-option').forEach((optionTag: HTMLDivElement, i) => {
                let option = new Option(optionTag, this, i);
                this.options.push(option);
                if (option.selected) {
                    this.onSelectOption(option);
                }
            });
            if (!this.nullable && !this.selectedOption && this.selectedOptions.length === 0) {
                if (this.options.length > 0) {
                    this.onSelectOption(this.options[0]);
                }
            }
        }
        // @ts-ignore
        this.self.__DropdownByDimkys = this;
        Dropdown.dropdowns.push(this);
        if (name) {
            Dropdown.namedDropdowns[name] = this;
            if (Dropdown.waitDropdown[name]) {
                Dropdown.waitDropdown[name](this);
            }
        }
    }

    disable() {
        this.self.classList.remove('active');
        Dropdown.activeDropdown = null;
        this.isActive = false;
    }

    enable() {
        if (Dropdown.activeDropdown) {
            Dropdown.activeDropdown.disable()
        }
        Dropdown.activeDropdown = this;
        this.isActive = true;
        this.self.classList.add('active');
    }

    isEmpty() {
        return (!this.selectedOptions || this.selectedOptions.length === 0) && !this.selectedOption;
    }

    updateTitle() {
        if (this.isMultiple) {
            this.titleTag.textContent = this.selectedOptions.length > 0 ? `Выбрано (${this.selectedOptions.length})` : this.titleDefault;
        } else {
            this.titleTag.textContent = this.selectedOption ? this.selectedOption.text : this.titleDefault;
        }
        if (this.callBack) {
            this.callBack(this.isMultiple ? this.selectedOptions : this.selectedOption);
        }
        if (!this.isEmpty()) {
            this.titleTag.classList.add('filled')
            this.self.classList.add('filled')
        } else {
            this.titleTag.classList.remove('filled')
            this.self.classList.remove('filled')
        }
    }

    selectOptionByValue(value) {
        this.options.forEach((option: Option) => {
            if (option.value === value) {
                this.onSelectOption(option);
            }
        })
    }

    //      Events
    onClickDropdown(e: Event) {
        if ((<HTMLElement>e.target).nodeName !== A_TAG_NODE_NAME) {
            if (this.isActive) {
                this.disable();
            } else {
                this.enable();
            }
        }
    }

    onFilteredOptions(e: Event) {
        let reg = new RegExp(`.*${(<HTMLInputElement>e.target).value}.*`, 'i');
        this.options.forEach((option: Option) => {
            if ((<HTMLInputElement>e.target).value) {
                if (option.text.search(reg) !== -1) {
                    option.show();
                } else {
                    option.hidden();
                }
            } else {
                option.show();
            }
        });
    }

    onMouseLeave() {
        this.disable();
    }

    clearOptions(option) {
        this.options.forEach((element) => {
            if (element.value != option) {
                element.self.style.display = "none"
            }
            if (element.value == option) {
                element.self.style.display = "block"
            }
        });
    }

    onSelectOption(option: Option) {
        if (this.isMultiple) {
            if (this.selectedOptions.includes(option)) {
                if (this.nullable || this.selectedOptions.length != 1) {
                    this.selectedOptions = this.selectedOptions.filter((item) => {
                        return item.index !== option.index;
                    });
                    option.deselect(true);
                }
            } else {
                this.selectedOptions.push(option);
                option.select(true);
            }
        } else {
            if (this.selectedOption) {
                if (this.selectedOption.index === option.index) {
                    if (this.nullable) {
                        this.selectedOption = null;
                        option.deselect(true);
                    }
                } else {
                    this.selectedOption.deselect();
                    this.selectedOption = option;
                    option.select(true);
                }
            } else {
                this.selectedOption = option;
                option.select(true);
            }
            this.disable();
        }
        this.updateTitle();

        if (this.events.select) {
            this.events.select.forEach((handler) => {
                handler(this.selectedOption)
            });
        }


    }

    //    End  Events
}

export default () => {
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    dropdowns.forEach((dropdown: HTMLElement) => {
        const newDropdown = new Dropdown(dropdown, dropdown.id || null);
        if (dropdown.id == "paymentMethod") {
            newDropdown.events.select = [() => {
                const shippingDropdown = Dropdown.namedDropdowns["shipping"];
                if (newDropdown && shippingDropdown) {

                    if (!newDropdown.isEmpty()) {
                        if (newDropdown.selectedOption.value == "cod") {
                            shippingDropdown.clearOptions("mail")
                            shippingDropdown.selectOptionByValue("mail")
                        }
                        if (newDropdown.selectedOption.value == "on_delivery") {
                            shippingDropdown.clearOptions("pickup")
                            shippingDropdown.selectOptionByValue("pickup")
                        }
                    }
                    if (newDropdown.isEmpty() || newDropdown.selectedOption.value == "online") {
                        shippingDropdown.options.forEach((element) => {
                            element.self.style.display = "block";
                        });
                    }

                    if (!shippingDropdown.isEmpty()) {
                        if (shippingDropdown.selectedOption.value == "pickup") {
                            document.getElementById("customer-address").parentElement.parentElement.style.display = "none"
                        } else {
                            document.getElementById("customer-address").parentElement.parentElement.style.display = "block"
                        }
                    }
                    if (shippingDropdown.isEmpty()) {
                        document.getElementById("customer-address").parentElement.parentElement.style.display = "block"
                    }

                }


            }]
        }
        if (dropdown.id == "shipping") {
            newDropdown.events.select = [() => {
                const shippingDropdown = Dropdown.namedDropdowns["shipping"];
                if (!shippingDropdown.isEmpty()) {
                    if (shippingDropdown.selectedOption.value == "pickup") {
                        document.getElementById("customer-address").parentElement.parentElement.style.display = "none"
                    } else {
                        document.getElementById("customer-address").parentElement.parentElement.style.display = "block"
                    }
                }
                if (shippingDropdown.isEmpty()) {
                    document.getElementById("customer-address").parentElement.parentElement.style.display = "block"
                }
                let finalPost = document.querySelector(".final-post");
                if (finalPost) {
                    if (shippingDropdown.selectedOption) {
                        if (shippingDropdown.selectedOption.value == "mail") {

                            // DEPRECATED
                            // const postCost = document.getElementById('shipping-cost-value').value.replace(/\,/g, '.');   
                            // let summary = Number(document.querySelector(".final-price").dataset.fcount.replace(/\,/g, '.')) + Number(postCost)

                            // document.querySelector(".final-price").innerHTML = "К оплате: " + summary.toFixed(2).replace(/\./g, ',') + " р."
                            // document.querySelector(".price-total").innerHTML = "К оплате: " + summary.toFixed(2).replace(/\./g, ',') + " р."
                            // finalPost.innerHTML = "Доставка: " + postCost + " р.";

                            finalPost.innerHTML = "";
                            document.querySelector(".final-price").innerHTML = "К оплате: " + document.querySelector(".final-price").dataset.fcount + " р."
                            document.querySelector(".price-total").innerHTML = "К оплате: " + document.querySelector(".final-price").dataset.fcount + " р."
                        } else {
                            finalPost.innerHTML = "";
                            document.querySelector(".final-price").innerHTML = "К оплате: " + document.querySelector(".final-price").dataset.fcount + " р."
                            document.querySelector(".price-total").innerHTML = "К оплате: " + document.querySelector(".final-price").dataset.fcount + " р."
                        }
                    }
                }
            }]
        }
    }
    )
        ;
}

