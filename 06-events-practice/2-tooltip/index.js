class Tooltip {
  static instance = null;

  element = document.createElement('div');

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    this.element.classList.add('tooltip');
    Tooltip.instance = this;
  }

  initialize() {
    this.createEventListener();
  }

  render(text) {
    document.body.append(this.element);
    this.element.style.visibility = 'visible';
    this.element.innerHTML = text;
  }

  handleHeaderPointerOut = (e) => {
    const item = e.target.closest('[data-tooltip]');
    if (!item) {
      return;
    }
    this.element.style.visibility = 'hidden';
  }

  handleHeaderPointerOver = (e) => {
    const item = e.target.closest('[data-tooltip]');
    if (!item) {
      return;
    }
    const text = item.dataset.tooltip;
    this.render(text);
  }

  createEventListener() {
    document.addEventListener('pointerover', this.handleHeaderPointerOver);
    document.addEventListener('pointerout', this.handleHeaderPointerOut);
  }

  destroyEventListener() {
    document.removeEventListener('pointerover', this.handleHeaderPointerOver);
    document.removeEventListener('pointerout', this.handleHeaderPointerOut);
  }

  destroy() {
    this.element.remove();
    this.destroyEventListener();
    Tooltip.instance = null;
  }
}

export default Tooltip;