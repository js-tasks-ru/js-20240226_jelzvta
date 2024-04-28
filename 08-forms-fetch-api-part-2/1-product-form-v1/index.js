import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';
const API_PRODUCTS = '/api/rest/products';
const API_CATEGORIES = '/api/rest/categories';

export default class ProductForm {
  constructor (productId = '') {
    this.productId = productId;
    this.defaultData = {
      title: '',
      description: '',
      subcategory: '',
      price: 0,
      quantity: 0,
      discount: 0,
      status: 0,
      images: []
    };
    this.formFields = {
      strings: ['title', 'description', 'subcategory'],
      numbers: ['price', 'discount', 'quantity', 'status'],
    };
    this.subElements = {};
  }

  // helpers
  collectSubElements(element) {
    const subElements = {};
    element.querySelectorAll('[id]').forEach((el) => {
      subElements[el.id] = el;
    });
    return subElements;
  }

  // fetch data
  async getProducts(id) {
    const url = new URL(API_PRODUCTS, BACKEND_URL);
    url.searchParams.set('id', id);
    return await fetchJson(url);
  }

  async getCategories() {
    const url = new URL(API_CATEGORIES, BACKEND_URL);
    url.searchParams.set('_sort', 'weight');
    url.searchParams.set('_refs', 'subcategory');
    return await fetchJson(url);
  }

  // events
  initEventListeners() {
    this.subElements.uploadImage.addEventListener('click', this.uploadImageHandler);
    this.subElements.productForm.addEventListener('submit', this.submitFormHandler);
  }

  submitFormHandler = (event) => {
    event.preventDefault();
    this.save();
  }

  async save() {
    const [method, eventType] = this.productId ? ['PATCH', 'product-updated'] : ['PUT', 'product-saved'];
    const url = new URL(API_PRODUCTS, BACKEND_URL);
    const response = await fetchJson(url, {
      method: method,
      body: JSON.stringify(this.getProductData())
    });

    this.element.dispatchEvent(new CustomEvent(eventType, {
      detail: {
        response: response
      }
    }));
  }

  getProductData() {
    const product = {};

    this.formFields.strings.forEach(field => {
      this.subElements[field] = this.subElements[field].value;
    });

    this.formFields.numbers.forEach(field => {
      this.subElements[field] = Number(this.subElements[field].value);
    });

    product.images = this.images || [];

    if (this.productId) {
      product.id = this.productId;
    }

    return product;
  }

  uploadImageHandler = () => {
    let fileInput = document.getElementById('imageUpload');

    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.id = 'imageUpload';
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.hidden = true;
      fileInput.addEventListener('change', this.changeHandler);
      document.body.append(fileInput);
    }

    fileInput.click();
  }

  changeHandler = (event) => {
    const [file] = event.target.files;

    if (!file) {
      return;
    }

    const uploadImage = this.subElements.productForm.elements.uploadImage;

    uploadImage.classList.add('is-loading');
    uploadImage.disabled = true;

    const formData = new FormData();
    formData.append('image', file);

    fetchJson('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
      },
      body: formData,
      referrer: ''
    }).then(response => {
      this.imageList.push({ url: response.data.link, source: file.name });
      this.subElements.imageListContainer.innerHTML = this.getImagesTemplate(this.imageList);
    })
    .catch(error => console.error(error.message))
    .finally(() => {
      uploadImage.classList.remove("is-loading");
      uploadImage.disabled = false;
    });
  }

  // render templates
  async render() {
    const div = document.createElement('div');
    div.innerHTML = this.createFormTemplate();
    this.element = div;
    this.subElements = this.collectSubElements(this.element);
    const promises = [
      this.getCategories(),
      this.productId ? this.getProducts(this.productId) : Promise.resolve([this.defaultData])
    ];

    const [categories, products] = await Promise.all(promises);
    const [product] = products;

    this.setTemplateData(product, categories);

    this.initEventListeners();

    return this.element;
  }

  // templates
  createFormTemplate() {
    return `
    <form id="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea id="description" required="" class="form-control" name="description" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" >
        <label class="form-label">Фото</label>
        <div id="imageListContainer"></div>
        <button type="button" name="uploadImage" class="button-primary-outline" id="uploadImage"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
          <label class="form-label">Категория</label>
          <select class="form-control" name="subcategory" id="subcategory"></select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
          <fieldset>
              <label class="form-label">Цена ($)</label>
              <input required="" type="number" name="price" id="price" class="form-control" placeholder="100">
          </fieldset>
          <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input required="" type="number" name="discount" id="discount" class="form-control" placeholder="0">
          </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity"  id="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status" id="status">
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

  setTemplateData(product, categories) {
    for (const key in product) {
      if (this.subElements.hasOwnProperty(key)) {
        this.subElements[key].value = product[key];
      }
    }
    this.subElements.subcategory.innerHTML = this.getSubcategoryTemplate(categories);
    this.subElements.imageListContainer.innerHTML = this.getImagesTemplate(product.images);
  }

  getSubcategoryTemplate(data) {
    return data.map(category => {
      return category.subcategories.map(subcategory => {
        return `<option value="${subcategory.id}">${category.title} &gt; ${subcategory.title}</option>`;
      }).join('');
    }).join('');
  }

  getImagesTemplate(data) {
    return `
        <ul class="sortable-list" id="images">
            ${data.map(image => this.getImageTemplate(image)).join('')}
        </ul>
    `;
  }

  getImageTemplate({ url, source }) {
    return `
        <li class="products-edit__imagelist-item sortable-list__item" style="">
            <input type="hidden" name="url" value="${url}">
            <input type="hidden" name="source" value="${source}">
            <span>
                <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(url)}"><span>${escapeHtml(source)}</span>
            </span>
            <button type="button">
                <img src="icon-trash.svg" data-delete-handle="" alt="delete">
            </button>
        </li>
    `;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

}
