export default class RangePicker {
    element
    constructor({from, to} = {}) {
      this.from = from;
      this.to = to;
      this.currentMonth = this.from.getMonth();
      this.currentYear = this.from.getFullYear();
      this.element = this.render();
      this.isOpen = false;
    }

    getSubElements(element) {
      const elements = element.querySelectorAll('[data-element]');
      return [...elements].reduce((acc, subElement) => {
        acc[subElement.dataset.element] = subElement;
        return acc;
      }, {});
    }

    getDateString(date) {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return date.toLocaleDateString('ru-RU', options);
    }

    render() {
      const wrapper = document.createElement('div');
      const isOpen = false;
      wrapper.innerHTML = `
        <div class="rangepicker" data-element="rangepicker">
            <div class="rangepicker__input" data-element="input">
                <span data-element="from">${this.getDateString(this.from)}</span> -
                <span data-element="to">${this.getDateString(this.to)}</span>
            </div>
            <div class="rangepicker__selector" data-element="selector" style="display: none;"></div>
        </div>
      `;
      this.subElements = this.getSubElements(wrapper);
      this.initEventListeners();
      return wrapper.firstElementChild;
    }

    initEventListeners() {
      // open/close calendar
      this.subElements.input.addEventListener('click', this.onInputClick);
      // outside close calendar
      document.addEventListener('click', this.onOutsideClick, true);
      // arrows
      this.subElements.selector.addEventListener('click', (e) => {
        if (e.target.classList.contains('rangepicker__selector-control-left')) {
          this.goToPreviousMonth();
        } else if (e.target.classList.contains('rangepicker__selector-control-right')) {
          this.goToNextMonth();
        }
      });
    }

    goToPreviousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.updateSelector();
    }

    goToNextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.updateSelector();
    }

    updateSelector() {
      this.subElements.selector.innerHTML = this.rangePickerTemplate();
      this.addCalendarEventListeners();

      this.updateInput();
    }

    updateInput() {
      if (this.to === null) {
        return;
      }

      const fromText = this.from.toLocaleDateString('ru-RU');
      const toText = this.to.toLocaleDateString('ru-RU');

      this.subElements.from.textContent = fromText;
      this.subElements.to.textContent = toText;
    }

    addCalendarEventListeners() {
      const buttons = this.subElements.selector.querySelectorAll('.rangepicker__cell');
      buttons.forEach((button) => {
        button.addEventListener('click', this.onCalendarDateClick);
      });
    }

    onCalendarDateClick = (e) => {
      const clickedDate = new Date(e.currentTarget.dataset.value);

      if (this.to !== null) {
        this.from = clickedDate;
        this.to = null;
        this.updateSelector();
      } else {
        this.to = clickedDate;

        if (this.from > this.to) {
          [this.from, this.to] = [this.to, this.from];
        }

        this.updateSelector();
      }

      this.updateInput();
    };

    openSelector() {
      this.subElements.rangepicker.classList.add('rangepicker_open');
      this.subElements.selector.style.display = 'block';
      this.subElements.selector.innerHTML = `${this.rangePickerTemplate()}`;
      this.isOpen = true;
      this.addCalendarEventListeners();
    }

    closeSelector() {
      this.subElements.rangepicker.classList.remove('rangepicker_open');
      this.subElements.selector.style.display = 'none';
      this.isOpen = false;
    }

    onInputClick = (e) => {
      e.stopPropagation();
      if (this.isOpen) {
        this.closeSelector();
      } else {
        this.openSelector();
      }
    };

    onOutsideClick = (e) => {
      if (!this.element.contains(e.target)) {
        this.closeSelector();
      }
    };

    rangePickerTemplate() {
      const fromDate = this.from ? this.from.toLocaleDateString('en-CA') : '';
      const toDate = this.to ? (this.to).toLocaleDateString('en-CA') : '';

      return ` <div class="rangepicker__selector-arrow"></div>
          <div class="rangepicker__selector-control-left"></div>
          <div class="rangepicker__selector-control-right"></div>
          ${this.generateDateButtons(fromDate, toDate)}`;
    }

    generateDateButtons(fromDate, toDate) {
      const startDate = new Date(this.currentYear, this.currentMonth);
      const nextMonthDate = new Date(this.currentYear, this.currentMonth + 1);

      let calendarHTML = '';

      calendarHTML += this.generateMonthMarkup(startDate, fromDate, toDate);
      calendarHTML += this.generateMonthMarkup(nextMonthDate, fromDate, toDate);

      return calendarHTML;
    }

    generateMonthMarkup(date, fromDate, toDate) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const firstDayOfMonth = new Date(year, month - 1, 1);
      const lastDayOfMonth = new Date(year, month, 0);

      let buttons = [];

      for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
        const dateISO = d.toLocaleDateString('en-CA');

        let cellClass = 'rangepicker__cell';
        const isStart = fromDate && dateISO === fromDate;
        const isEnd = toDate && dateISO === toDate;
        const isBetween = fromDate && toDate && dateISO > fromDate && dateISO < toDate;

        if (isStart) {
          cellClass += ' rangepicker__selected-from';
        } else if (isEnd) {
          cellClass += ' rangepicker__selected-to';
        } else if (isBetween) {
          cellClass += ' rangepicker__selected-between';
        }

        buttons.push(`<button type="button" class="${cellClass}" data-value="${dateISO}">${d.getDate()}</button>`);
      }

      return `<div class="rangepicker__calendar">
                <div class="rangepicker__month-indicator">
                  <time datetime="${year}-${month}-01">${Intl.DateTimeFormat('ru', { month: 'long' }).format(new Date(year, month - 1, 1))}</time>
                </div>
                <div class="rangepicker__day-of-week">
                  <div>Пн</div>
                  <div>Вт</div>
                  <div>Ср</div>
                  <div>Чт</div>
                  <div>Пт</div>
                  <div>Сб</div>
                  <div>Вс</div>
                </div>
                <div class="rangepicker__date-grid">
                  ${buttons.join('')}
                </div>
              </div>`;
    }

    remove() {
      if (this.element) {
        this.element.remove();
      }
    }
    destroy() {
      this.remove();
    }
}
