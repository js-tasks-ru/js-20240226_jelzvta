import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

export default class SortableTableV3 extends SortableTableV2 {

  constructor(headerConfig, {url = ''}) {
    super(headerConfig);
    this.url = url;
    document.addEventListener('scroll', this.handleScroll());
  }

  loadingTemplate() {
    this.loadingElement = document.createElement('div');
    this.loadingElement.classList.add('loading-line', 'sortable-table__loading-line');
    this.loadingElement.dataset.element = 'loading';
    return this.loadingElement;
  }

  emptyTemplate() {
    return `<div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
              <div>
                <p>No products satisfies your filter criteria</p>
                <button type="button" class="button-primary-outline">Reset all filters</button>
              </div>
            </div>`;
  }

  async render() {
    const data = await fetchJson(`${BACKEND_URL}/${this.url}`);
    this.update(data);
  }

  async sortOnServer(id, order) {
    const data = await this.loadDataWithSorting(id, order);
    if (!data) {
      const { body } = this.subElements;
      body.innerHTML = this.emptyTemplate();
    }
    this.update(data);
  }

  handleScroll() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.scrollY;

    if (documentHeight - windowHeight <= scrollPosition + 100) {
      this.render();
    }
  }

  async loadDataWithSorting(id, order) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set('_sort', id);
    url.searchParams.set('_order', order);
    return await fetchJson(url);
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }

}
