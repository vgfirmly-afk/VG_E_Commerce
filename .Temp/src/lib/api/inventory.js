import { API_CONFIG } from '../config.js';
import { fetchJSON } from './fetchClient.js';

const INVENTORY_URL = API_CONFIG.INVENTORY_WORKER_URL;

export async function getStock(skuId) {
  return await fetchJSON(`${INVENTORY_URL}/api/v1/stock/${skuId}`);
}

export async function checkAvailability(skuIds) {
  return await fetchJSON(`${INVENTORY_URL}/api/v1/stock/check`, {
    method: 'POST',
    body: JSON.stringify({ sku_ids: skuIds }),
  });
}

