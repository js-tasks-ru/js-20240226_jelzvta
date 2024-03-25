export default class DoubleSlider {
    element;
    subElements = {};

    constructor({
      min = 100,
      max = 200,
      selected = {},
      formatValue = data => `${data}`
    } = {}) {
      this.min = min ?? 100;
      this.max = max ?? 200;
      this.formatValue = formatValue;
      this.from = selected.from || min;
      this.to = selected.to || max;

      this.element = this.createSliderTemplate();

      this.getSubElements();
      this.createEventListeners();
    }

    getSubElements () {
      this.element.querySelectorAll('[data-element]').forEach((element) => {
        this.subElements[element.dataset.element] = element;
      });
    }

    createSliderTemplate() {
      const slider = document.createElement('div');
      slider.classList.add('range-slider');
      slider.innerHTML =
            `<span data-element="from" > ${this.formatValue(this.from)} </span>
            <div class="range-slider__inner" data-element="container">
                <span data-element="thumbProgress" class="range-slider__progress" style="right:${this.getPercentRight()}; left:${this.getPercentLeft()}"></span>
                <span data-element="thumbLeft" class="range-slider__thumb-left" style="left:${this.getPercentLeft()}"></span>
                <span data-element="thumbRight" class="range-slider__thumb-right" style="right:${this.getPercentRight()}"></span>
            </div>
          <span data-element="to" >${this.formatValue(this.to)}</span>`;
      return slider;
    }

    getPercentLeft() {
      const total = this.max - this.min;
      const value = this.from - this.min;
      return `${Math.round(value / total * 100)}%`;
    }

    getPercentRight() {
      const total = this.max - this.min;
      const value = this.max - this.to;
      return `${Math.round(value / total * 100)}%`;
    }

    remove() {
      this.element.remove();
    }

    processPointerMove = (e) => {
      const { left, width } = this.subElements.container.getBoundingClientRect();

      const containerLeftX = left;
      const containerRightX = left + width;
      const pointerX = e.clientX;
      const normalizedPointerX = Math.min(
        containerRightX,
        Math.max(containerLeftX, pointerX),
      );
      const percentPointerX = Math.round(
        (
          (normalizedPointerX - containerLeftX) /
                (containerRightX - containerLeftX)
        ) * 100,
      );
      return this.min + ((this.max - this.min) * percentPointerX) / 100;
    }

    createEventListeners() {
      this.subElements.thumbLeft.addEventListener('pointerdown', this.handlePointerDown);
      this.subElements.thumbRight.addEventListener('pointerdown', this.handlePointerDown);
    }

    handlePointerDown = (e) => {
      this.activeThumb = e.target.dataset.element;
      document.addEventListener('pointermove', this.handleDocumentPointerMove);
      document.addEventListener('pointerup', this.handleDocumentPointerup);
    }

    handleDocumentPointerup = (e) => {
      this.activeThumb = null;
      this.dispatchCustomEvent();
      document.removeEventListener('pointermove', this.handleDocumentPointerMove);
      document.removeEventListener('pointerup', this.handleDocumentPointerup);
    }

    handleDocumentPointerMove = (e) => {
      if (this.activeThumb === 'thumbLeft') {
        this.from = Math.min(this.to, this.processPointerMove(e));
        this.subElements.from.textContent = this.formatValue(this.from);
        this.subElements.thumbLeft.style.left = this.getPercentLeft();
        this.subElements.thumbProgress.style.left = this.getPercentLeft();
      }
      if (this.activeThumb === 'thumbRight') {
        this.to = Math.max(this.from, this.processPointerMove(e));
        this.subElements.to.textContent = this.formatValue(this.to);
        this.subElements.thumbRight.style.right = this.getPercentRight();
        this.subElements.thumbProgress.style.right = this.getPercentRight();
      }
    }

    dispatchCustomEvent() {
      const event = new CustomEvent('range-select', {
        detail: {
          from: this.from,
          to: this.to,
        },
      });
      this.element.dispatchEvent(event);
    }

    destroyEventListeners() {
      this.subElements.thumbLeft.removeEventListener(
        'pointerdown',
        this.handlePointerDown,
      );
      this.subElements.thumbRight.removeEventListener(
        'pointerdown',
        this.handlePointerDown,
      );
    }

    destroy() {
      this.remove();
      this.destroyEventListeners();
    }
}
