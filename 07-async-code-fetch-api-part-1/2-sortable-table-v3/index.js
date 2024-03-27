import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

export default class SortableTableV3 extends SortableTableV2 {

  constructor(headerConfig, {url = ''}) {
    super(headerConfig);
    this.url = url;
    this.render();
  }

  loadingTemplate() {
    const loadingElement = document.createElement('div');
    loadingElement.classList.add('loading-line sortable-table__loading-line');
    loadingElement.setAttribute('data-element', 'loading');
    return loadingElement;
  }

  async render() {
    const data = await fetchJson(`${BACKEND_URL}/${this.url}`);
    this.update(data);
  }

  async sortOnServer(id, order) {
    const data = await this.loadDataWithSorting(id, order);
    this.update(data);
  }

  async loadDataWithSorting(id, order) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set('_sort', id);
    url.searchParams.set('_order', order);
    return await fetchJson(url);
  }

}
