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
    }
}
