export default class DoubleSlider {
    element;
    leftPointer;
    rightPointer;
    sliderInner;
    sliderProgress;
    isLeftDragging = false;
    isRightDragging = false;

    constructor({
      min = 0,
      max = 100,
      selected = {},
      formatValue = data => `$${data}`
    } = {}) {
      this.min = min;
      this.max = max;
      this.selected = selected;
      this.selected.from = selected.from || this.min;
      this.selected.to = selected.to || this.max;
      this.formatValue = formatValue;
      this.element = this.createSliderTemplate();
      this.createEventListeners();
      this.leftPointer = this.element.querySelector('.range-slider__thumb-left');
      this.rightPointer = this.element.querySelector('.range-slider__thumb-right');
      this.sliderInner = this.element.querySelector('.range-slider__inner');
      this.sliderProgress = this.element.querySelector('.range-slider__progress');
      this.rangeTextLeft = this.element.querySelector('span[data-element="from"]');
      this.rangeTextRight = this.element.querySelector('span[data-element="to"]');
      const leftPosition = ((this.selected.from - this.min) / (this.max - this.min)) * 100;
      const rightPosition = (-(this.selected.to - this.max) / (this.max - this.min)) * 100;
      this.leftPointer.style.left = leftPosition + '%';
      this.rightPointer.style.right = rightPosition + '%';
      this.sliderProgress.style.left = leftPosition + '%';
      this.sliderProgress.style.right = rightPosition + '%';
    }

    createSliderTemplate() {
      const slider = document.createElement('div');
      slider.classList.add('range-slider');
      slider.innerHTML =
            `<span data-element="from" > ${this.formatValue(this.selected.from)} </span>
            <div class="range-slider__inner">
                <span class="range-slider__progress"></span>
                <span class="range-slider__thumb-left"></span>
                <span class="range-slider__thumb-right"></span>
            </div>
          <span data-element="to" >${this.formatValue(this.selected.to)}</span>`;
      return slider;
    }

    createEventListeners() {
      this.element.addEventListener('pointerdown', this.handlePointerDown.bind(this));
      this.element.addEventListener('pointerup', this.handlePointerUp.bind(this));
      document.addEventListener('pointerup', this.handlePointerUp.bind(this));
      document.addEventListener('pointerleave', this.handlePointerUp.bind(this));
    }

    handlePointerDown(event) {
      if (event.target.classList.contains('range-slider__thumb-left')) {
        this.isLeftDragging = true;
      }
      if (event.target.classList.contains('range-slider__thumb-right')) {
        this.isRightDragging = true;
      }
      if (!this.isLeftDragging && !this.isRightDragging) {
        return;
      }
      this.element.addEventListener('pointermove', this.handlerPointerMove.bind(this));
      document.addEventListener('pointermove', this.handlerPointerMove.bind(this));
    }

    handlerPointerMove(event) {
      if (!this.isLeftDragging && !this.isRightDragging) {
        return;
      }
      const sliderRect = this.sliderInner.getBoundingClientRect();
      let newPosition = event.clientX - sliderRect.left;
      newPosition = Math.max(0, Math.min(this.sliderInner.offsetWidth, newPosition));
      if (this.isLeftDragging) {
        newPosition = Math.max(0, newPosition); // Ограничиваем движение влево
        this.leftPointer.style.left = newPosition + 'px';
        this.sliderProgress.style.left = newPosition + 'px';
        const leftPositionPercent = parseFloat(this.leftPointer.style.left) / this.sliderInner.offsetWidth;
        const fromValue = Math.round(this.min + (leftPositionPercent * (this.max - this.min)));
        this.rangeTextLeft.textContent = this.formatValue(fromValue);
      }
      if (this.isRightDragging) {
        this.rightPointer.style.right = (this.sliderInner.offsetWidth - newPosition) + 'px';
        this.sliderProgress.style.right = (this.sliderInner.offsetWidth - newPosition) + 'px';
        const rightPositionPercent = parseFloat(this.rightPointer.style.right) / this.sliderInner.offsetWidth;
        const toValue = Math.round(this.max - (rightPositionPercent * (this.max - this.min)));
        this.rangeTextRight.textContent = this.formatValue(toValue);
      }
    }

    handlePointerUp() {
      this.isLeftDragging = false;
      this.isRightDragging = false;
      this.element.removeEventListener('pointermove', this.handlerPointerMove.bind(this));
      document.removeEventListener('pointermove', this.handlerPointerMove.bind(this));
      this.element.removeEventListener('pointerup', this.handlePointerUp.bind(this));
      document.removeEventListener('pointerup', this.handlePointerUp.bind(this));
      document.removeEventListener('pointerleave', this.handlePointerUp.bind(this));

      const fromValue = parseFloat(this.rangeTextLeft.textContent);
      const toValue = parseFloat(this.rangeTextRight.textContent);

      const customEvent = new CustomEvent('range-select', {
        bubbles: true,
        detail: {
          from: fromValue,
          to: toValue
        }
      });

      this.element.dispatchEvent(customEvent);
    }

    destroy() {
      this.element.remove();
    }
}
