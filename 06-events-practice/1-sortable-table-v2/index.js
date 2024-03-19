import SortableTable from '../../05-dom-document-loading/2-sortable-table-v1/index.js';
export default class SortableTableV2 extends SortableTable {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}, isSortLocally) {
    super(headersConfig, data, sorted);
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.createEventListeners();
  }

  createCellHeaderTemplate() {
    return this.headerConfig.map(({id, title, sortable}) => {
      return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="asc">
          <span>${title}</span>
          ${title === 'Name' ? `<span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>` : ''}
        </div>
      `;
    }).join('');
  }

  handleHeaderPointerDown = (e) => {
    const columnElement = e.target.closest('[data-sortable="true"]');

    if (!columnElement) {
      return;
    }
    const fieldName = columnElement.dataset.id;
    const orderName = columnElement.dataset.order === 'asc' ? 'desc' : 'asc';

    super.sort(fieldName, orderName);
  }

  createEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderPointerDown);
  }

  destroyEventListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderPointerDown);
  }

  sort () {
    if (this.isSortLocally) {
      this.sortOnClient();
    } else {
      this.sortOnServer();
    }
  }

  destroy() {
    super.destroy();
    this.destroyEventListeners();
  }
}
