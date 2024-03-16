export default class SortableTable {
  element;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createCommonTemplate();
    this.subElements = this.getSubElements(this.element);
  }

  loadingTemplate() {
    return `
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
            <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
            <div>
              <p>No products satisfies your filter criteria</p>
              <button type="button" class="button-primary-outline">Reset all filters</button>
            </div>
          </div>
        </div>
      `;
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  createCommonTemplate() {
    const productsContainer = document.createElement('div');
    productsContainer.setAttribute('data-element', 'productsContainer');
    productsContainer.classList.add('products-list__container');
    productsContainer.innerHTML =
    `<div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.createCellHeaderTemplate()}
        </div>
        <div data-element="body" class="sortable-table__body">'
          ${this.createCellTemplate()}
        </div>
      </div>
    </div>`;
    return productsContainer;
  }

  createCellHeaderTemplate() {
    return this.headerConfig.map(({id, title, sortable}) => {
      return `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        ${title === 'Name' ? `<span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>` : ''}
      </div>`;
    }).join('');
  }

  createCellTemplate() {
    return this.data.map(({ id, title, images, quantity, price, sales }) => {
      const imageCell = this.headerConfig.find(column => column.id === 'images');
      const imageContent = imageCell ? imageCell.template({ url: images }) : `<img class="sortable-table-image" alt="Image" src="${images}">`;

      const cells = this.headerConfig.map(column => {
        if (column.id === 'images') {
          return `<div class="sortable-table__cell">${imageContent}</div>`;
        } else {
          const content = column.template ? column.template({ [column.id]: eval(column.id) }) : eval(column.id);
          return `<div class="sortable-table__cell">${content}</div>`;
        }
      }).join('');

      return `<a href="/products/${id}" class="sortable-table__row">${cells}</a>`;
    }).join('');
  }

  sort(fieldValue, optionValue) {
    const k = optionValue === 'asc' ? 1 : -1;
    if (fieldValue === 'image') {
      return;
    }
    const sortedData = [...this.data].sort((a, b) => {
      const keyA = a[fieldValue];
      const keyB = b[fieldValue];

      const sortType = this.headerConfig.find(headerItem => headerItem.id === fieldValue)?.sortType;

      if (sortType === 'number') {
        return (keyA - keyB) * k;
      } else if (sortType === 'string') {
        return k * keyA.localeCompare(keyB, ['ru', 'en'], {caseFirst: 'upper'});
      } else {
        return 0;
      }
    });
    this.update(sortedData);
  }


  update(sortedData) {
    this.data = sortedData;
    const { body } = this.subElements;
    body.innerHTML = this.createCellTemplate(sortedData);
  }

  destroy() {
    this.element.remove();
  }
}

