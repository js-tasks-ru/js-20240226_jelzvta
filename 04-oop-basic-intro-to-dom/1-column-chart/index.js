export default class ColumnChart {
    element;
    chartHeight = 50;

    constructor({
      data = [],
      label = '',
      value = 0,
      link = '',
      formatHeading = data => data
    } = {}) {
      this.data = data;
      this.label = label;
      this.value = value;
      this.link = link;
      this.formatHeading = formatHeading;
      this.element = this.createChart();
    }

    createChart() {
      const element = document.createElement('div');
      element.innerHTML = this.createTemplate();
      return element.firstElementChild;
    }

    createTemplate() {
      return `<div class="column-chart ${this.data.length === 0 ? `column-chart_loading` : ''}" style="--chart-height: 50">
                    <div class="column-chart__title">
                        Total ${this.label}
                        ${this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : ''}
                    </div>
                    <div class="column-chart__container">
                        <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
                        <div data-element="body" class="column-chart__chart">
                            ${this.getColumnBody(this.data)}
                        </div>
                    </div>
                </div>`;
    }

    getColumnBody(data) {
      const maxValue = Math.max(...data);
      const scale = 50 / maxValue;
      return data.map(item => {
        const percent = (item / maxValue * 100).toFixed(0);
        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      }).join('');
    }

    update(data) {
      this.element.querySelector('.column-chart__chart').innerHTML = this.getColumnBody(data);
    }

    remove() {
      this.element.remove();
    }
    destroy() {
      this.remove();
    }
}


