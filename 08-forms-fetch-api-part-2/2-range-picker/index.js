export default class RangePicker {
    element
    constructor({from, to} = {}) {
      this.from = from;
      this.to = to;
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
      // outside click
      document.addEventListener('click', this.onOutsideClick, true);
      // staff with dates in calendar

    }

    addCalendarEventListeners() {
      const buttons = this.subElements.selector.querySelectorAll('.rangepicker__cell');
      buttons.forEach((button) => {
        button.addEventListener('click', this.onCalendarDateClick);
      });
    }

    onCalendarDateClick = (e) => {
      const clickedDate = new Date(e.currentTarget.dataset.value);
      console.log(clickedDate);
      if (clickedDate < this.from || clickedDate > this.to) {
        this.from = clickedDate;
        this.to = null;
        this.updateSelector();
      }
      else {
        this.from = clickedDate;
        this.to = null;
      }
    };

    updateSelector() {
      this.subElements.selector.innerHTML = this.rangePickerTemplate();
    }

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
      const fromDate = this.from.toISOString().split('T')[0];
      const toDate = this.to.toISOString().split('T')[0];

      return ` <div class="rangepicker__selector-arrow"></div>
          <div class="rangepicker__selector-control-left"></div>
          <div class="rangepicker__selector-control-right"></div>
          ${this.generateDateButtons(fromDate, toDate)}`;
    }

    generateDateButtons (fromDate, toDate) {
      const buttons = [];

      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      const endMonth = endDate.getMonth() + 1;

      console.log(startYear, endYear, startMonth, endMonth);

      let calendarHTML = '';
      for (let year = startYear; year <= endYear; year++) {
        for (let month = (year === startYear ? startMonth : 1); month <= (year === endYear ? endMonth : 12); month++) {
          console.log(new Date(year, month - 1).toLocaleDateString('ru-RU', {month: 'long'}));
          calendarHTML += `<div class="rangepicker__calendar">
                            <div class="rangepicker__month-indicator">
                              <time datetime="${(new Date(year, month - 1).toLocaleDateString('en', {month: 'long'}))}">${(new Date(year, month - 1).toLocaleDateString('ru-Ru', {month: 'long'}))}</time>
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
                              ${this.generateMonthMarkup(year, month, startDate, endDate)}
                            </div>
                          </div>`;}
      }

      return calendarHTML;
    }

    generateMonthMarkup (year, month, fromDate, toDate) {
      const buttons = [];

      const formattedFromDate = fromDate.toISOString().split('T')[0];
      const formattedToDate = toDate.toISOString().split('T')[0];

      const firstDayOfMonth = new Date(year, month - 1, 1);
      const lastDayOfMonth = new Date(year, month, 0);

      for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
        const dateISO = d.toISOString().split('T')[0];

        const isStart = dateISO === formattedFromDate;
        const isEnd = dateISO === formattedToDate;
        const isBetween = dateISO > formattedFromDate && dateISO < formattedToDate;

        let cellClass = 'rangepicker__cell';
        if (isStart) {
          cellClass += ' rangepicker__selected-from';
        } else if (isEnd) {
          cellClass += ' rangepicker__selected-to';
        } else if (isBetween) {
          cellClass += ' rangepicker__selected-between';
        }

        buttons.push(`<button type="button" class="${cellClass}" data-value="${dateISO}">${d.getDate()}</button>`);
      }

      return buttons.join('');
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
