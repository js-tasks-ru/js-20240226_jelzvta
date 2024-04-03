import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

import ColumnChart from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

export default class ColumnChartV2 extends ColumnChart {
    subElements = {};

    constructor({ url = '', range = {}, label = '', link = '', formatHeading} = {}) {
      super({ url, range, label, link, formatHeading });
      this.url = url;
      this.to = range.to;
      this.from = range.from;
      this.label = label;
      this.link = link;
      this.formatHeading = data => data;
      this.getSubElements();
    }

    getSubElements () {
      this.element.querySelectorAll('[data-element]').forEach((element) => {
        this.subElements[element.dataset.element] = element;
      });
    }

    async getData(from, to) {
      const ordersData = await fetchJson(`${BACKEND_URL}/${this.url}?from=${from}&to=${to}`);
      return ordersData;
    }

    async update(from, to) {
      const rawData = await this.getData(from, to);
      this.data = Object.values(rawData);
      this.subElements.body.innerHTML = this.getColumnBody(this.data);
      document.querySelector('.column-chart').classList.remove('column-chart_loading');
      return rawData;
    }

}
