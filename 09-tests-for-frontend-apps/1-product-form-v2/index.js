import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';
const API_PRODUCTS = '/api/rest/products';
const API_CATEGORIES = '/api/rest/categories';

import ProductForm from '../../08-forms-fetch-api-part-2/1-product-form-v1/index.js';

export default class ProductFormV2 extends ProductForm {
  constructor (productId = '') {
    super(productId);
    this.productId = productId;
  }
}
