import ProductForm from '../../08-forms-fetch-api-part-2/1-product-form-v1/index.js';
import SortableList from '../../09-tests-for-frontend-apps/2-sortable-list/index.js';

class SortableListV2 extends SortableList {
  constructor({ items = [] } = {}) {
    super({ items });
  }
  render() {
    this.element = this.items;
    super.initEventListeners();
  }
}

export default class ProductFormV2 extends ProductForm {
  constructor(productId = '') {
    super(productId);
    this.productId = productId;
    this.sortableList = null;
  }

  initEventListeners() {
    super.initEventListeners();
    this.sortableList = new SortableListV2({ items: this.subElements.imageListContainer });
  }
}
