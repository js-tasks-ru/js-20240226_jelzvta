export default class DoubleSlider {
    element;
    leftPointer;
    rightPointer;
    sliderInner;
    sliderProgress;
    isLeftDragging = false;
    isRightDragging = false;

    constructor({
      min = '',
      max = '',
      selected = {},
      formatValue = data => `$${data}`
    } = {}) {
      this.min = min;
      this.max = max;
      this.selected = selected;
      this.formatValue = formatValue;
      this.element = this.createSliderTemplate();
      this.createEventListeners();
      this.leftPointer = this.element.querySelector('.range-slider__thumb-left');
      this.rightPointer = this.element.querySelector('.range-slider__thumb-right');
      this.sliderInner = this.element.querySelector('.range-slider__inner');
      this.sliderProgress = this.element.querySelector('.range-slider__progress');
    }

    createSliderTemplate() {
      const slider = document.createElement('div');
      slider.classList.add('range-slider');
      slider.innerHTML =
            `<span [data-element="from"]>${this.selected.from ? this.formatValue(this.selected.from) : this.formatValue('0')}</span>
            <div class="range-slider__inner">
                <span class="range-slider__progress"></span>
                <span class="range-slider__thumb-left"></span>
                <span class="range-slider__thumb-right"></span>
            </div>
          <span [data-element="to"]>${this.selected.to ? this.formatValue(this.selected.to) : this.formatValue('100')}</span>`;
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
        this.leftPointer.style.left = newPosition + 'px';
        this.sliderProgress.style.left = newPosition + 'px';
      }
      if (this.isRightDragging) {
        this.rightPointer.style.right = (this.sliderInner.offsetWidth - newPosition) + 'px';
        this.sliderProgress.style.right = (this.sliderInner.offsetWidth - newPosition) + 'px';
      }
    }

    handlePointerUp() {
      console.log('pointerup');
      this.isLeftDragging = false;
      this.isRightDragging = false;
      this.element.removeEventListener('pointermove', this.handlerPointerMove.bind(this));
      document.removeEventListener('pointermove', this.handlerPointerMove.bind(this));
      this.element.removeEventListener('pointerup', this.handlePointerUp.bind(this));
      document.removeEventListener('pointerup', this.handlePointerUp.bind(this));
      document.removeEventListener('pointerleave', this.handlePointerUp.bind(this));
    }

    destroy() {
      this.element.remove();
    }
}
