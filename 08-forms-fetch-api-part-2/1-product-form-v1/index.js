import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element = document.createElement('div');
  subElements = {};
  product;
  subcategories;
  constructor (productId = '') {
    this.productId = productId;
    this.element.classList.add('product-form');
    this.getSubElements();
    this.render();
  }

  getSubElements() {
    this.element.querySelectorAll('[data-element]').forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }

  async fetchProductData() {
    if (this.productId) {
      const data = await fetchJson(`${BACKEND_URL}/api/rest/products?id=${this.productId}`);
      if (data && data.length > 0) {
        this.product = data[0];
      }
    }
    const categoriesData = await fetchJson(`${BACKEND_URL}/api/rest/categories?_refs=subcategory`);
    this.subcategories = categoriesData;
  }

  async render() {
    await this.fetchProductData();
    const formTemplate = this.createFormTemplate(this.product, this.subcategories);
    this.element.innerHTML = formTemplate;
    return this.element;
  }


  getSubcategory(subcategories) {
    let subCategoriesOptions = '';
    subcategories.forEach(({subcategories, title: mainTitle}) => {
      subcategories.forEach(({title: subTitle, id}) => {subCategoriesOptions += `<option value="${id}">${mainTitle} > ${subTitle}</option>`;});
    });
    return subCategoriesOptions;
  }

  createFormTemplate(product, subcategories) {
    const productData = {
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      discount: product.discount || '',
      quantity: product.quantity || '',
      status: product.status || '',
    };
    const {title, description, price, discount, quantity, status} = productData;
    return `<form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" name="title" class="form-control" value="${escapeHtml(title)}" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${escapeHtml(description)}</textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer"><ul class="sortable-list"><li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="">
          <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
          <span>
        <img src="icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="">
        <span>75462242_3746019958756848_838491213769211904_n.jpg</span>
      </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button></li></ul></div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory" id="subcategory">${this.getSubcategory(subcategories)}</select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input value="${price}" required="" type="number" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input value="${discount}" required="" type="number" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input value="${quantity}" required="" type="number" class="form-control" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>`;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  save() {

  }
}
