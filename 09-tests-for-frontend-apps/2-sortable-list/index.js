export default class SortableList {
    element;
    constructor({
      data = [],
      items = data => data
    } = {}) {
      this.data = data;
      this.items = items;
      this.render();
    }
    render() {
      this.element = document.createElement('ul');
      this.element.className = 'sortable-list';
      this.items.forEach(item => {
        item.classList.add('sortable-list__item');
        this.element.append(item);
      });
      this.initEventListeners();
    }

    initEventListeners() {
      const grabHandle = this.element.querySelectorAll('[data-grab-handle]');
      grabHandle.forEach(el => el.addEventListener('pointerdown', this.onPointerDown));
      const deleteHandle = this.element.querySelectorAll('[data-delete-handle]');
      deleteHandle.forEach(el => el.addEventListener('pointerdown', this.onDeleteHandle));
    }

    onDeleteHandle = (event) => {
      const deleteHandle = event.target.closest('[data-delete-handle]');
      if (deleteHandle) {
        deleteHandle.closest('.sortable-list__item').remove();
      }
    }

    onPointerDown = (event) => {
      const grabHandle = event.target.closest('[data-grab-handle]');
      if (grabHandle) {
        event.preventDefault();
        this.draggingElement = grabHandle.closest('.sortable-list__item');
        this.draggingElement.style.width = `${this.draggingElement.offsetWidth}px`;
        this.draggingElement.style.height = `${this.draggingElement.offsetHeight}px`;
        this.draggingElement.classList.add('sortable-list__item_dragging');
        this.element.append(this.draggingElement);
        this.moveAt(event);
        document.addEventListener('pointermove', this.onPointerMove);
        document.addEventListener('pointerup', this.onPointerUp);
      }
    }

    onPointerMove = (event) => {
      this.moveAt(event);
    }

    onPointerUp = () => {
      this.draggingElement.style.cssText = '';
      this.draggingElement.classList.remove('sortable-list__item_dragging');
      document.removeEventListener('pointermove', this.onPointerMove);
      document.removeEventListener('pointerup', this.onPointerUp);
    }

    moveAt(event) {
      this.draggingElement.style.left = `${event.clientX - this.draggingElement.offsetWidth / 2}px`;
      this.draggingElement.style.top = `${event.clientY - this.draggingElement.offsetHeight / 2}px`;
    }

    remove() {
      this.element.remove();
    }
    destroy() {
      this.remove();
    }
}
