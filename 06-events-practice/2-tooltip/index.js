class Tooltip {
  static instance = null;

  element = document.createElement('div');

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    document.addEventListener('mousemove', this.handleMouseMove);
    Tooltip.instance = this;
  }

  initialize() {
    this.createEventListener();
  }

  render(text) {
    this.element.classList.add('tooltip');
    document.body.append(this.element);
    this.element.style.visibility = 'visible';
    this.element.innerHTML = text;
  }

  handlePointerOut = (e) => {
    const item = e.target.closest('[data-tooltip]');
    if (!item) {
      return;
    }
    this.element.style.visibility = 'hidden';
  }

  handlePointerOver = (e) => {
    const item = e.target.closest('[data-tooltip]');
    if (!item) {
      return;
    }
    const text = item.dataset.tooltip;
    this.render(text);
  }

  handleMouseMove = (event) => {
    const tooltipOffset = 10;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    this.element.style.left = `${mouseX + tooltipOffset}px`;
    this.element.style.top = `${mouseY + tooltipOffset}px`;
  }

  createEventListener() {
    document.addEventListener('pointerover', this.handlePointerOver);
    document.addEventListener('pointerout', this.handlePointerOut);
  }

  destroyEventListener() {
    document.removeEventListener('pointerover', this.handlePointerOver);
    document.removeEventListener('pointerout', this.handlePointerOut);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  destroy() {
    this.element.remove();
    this.destroyEventListener();
    Tooltip.instance = null;
  }
}

export default Tooltip;
