import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

export default class SortableTableV3 extends SortableTableV2 {

  constructor(headerConfig, {url = '', pageSize = 20}) {
    super(headerConfig);
    this.url = url;
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.startItem = 0;
    this.endItem = this.startItem + this.pageSize;
    this.isLoading = false;
    this.render();
    this.addListeners();
  }

  addListeners() {
    document.addEventListener('scroll', this.handleScroll);
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
    this.isLoading = true;
    const data = await fetchJson(`${BACKEND_URL}/${this.url}?_start=${this.startItem}&_end=${this.endItem}`);
    this.updateTable(data);
    this.isLoading = false;
    if (data.length < this.pageSize) {
      this.destroyScrollListener();
    }
  }

  updateTable(data) {
    this.subElements.body.innerHTML += this.createBodyTemplate(data);
  }

  async sortOnServer(id, order) {
    const data = await this.loadDataWithSorting(id, order);
    if (!data) {
      const { body } = this.subElements;
      body.innerHTML = this.emptyTemplate();
    } else {
      this.updateTable(data);
    }
  }

  handleScroll = async () => {
    const distanceToBottom = document.documentElement.scrollHeight - (window.innerHeight + window.scrollY);
    const minDistanceToLoad = 200;

    if (distanceToBottom <= minDistanceToLoad && !this.isLoading) {
      this.currentPage++;
      this.startItem += this.pageSize;
      this.endItem = this.startItem + this.pageSize;
      await this.render();
    }
  }

  async loadDataWithSorting(id, order) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set('_sort', id);
    url.searchParams.set('_order', order);
    return await fetchJson(url);
  }

  destroy() {
    super.destroy();
    this.destroyScrollListener();
  }

  destroyScrollListener() {
    document.removeEventListener('scroll', this.handleScroll);
  }

}
