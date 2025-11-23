// services/paypalService.js
// PayPal Sandbox API integration
import { logger, logError } from '../utils/logger.js';
import { PAYPAL_CONFIG } from '../../config.js';

/**
 * Get PayPal OAuth access token
 */
export async function getPayPalAccessToken(clientId, clientSecret, env) {
  try {
    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured');
    }
    
    const auth = btoa(`${clientId}:${clientSecret}`);
    
    const response = await fetch(`${PAYPAL_CONFIG.BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      body: 'grant_type=client_credentials'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      logError('getPayPalAccessToken: PayPal OAuth failed', null, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`PayPal OAuth failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    logger('paypal.oauth.success', { expires_in: data.expires_in });
    return data.access_token;
  } catch (err) {
    logError('getPayPalAccessToken: Error', err);
    throw err;
  }
}

/**
 * Create PayPal Order
 */
export async function createPayPalOrder(orderData, env) {
  try {
    const clientId = env.PAYPAL_CLIENT_ID;
    const clientSecret = env.PAYPAL_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET as Wrangler secrets.');
    }
    
    const accessToken = await getPayPalAccessToken(clientId, clientSecret, env);
    
    const requestId = crypto.randomUUID();
    
    const orderPayload = {
      intent: orderData.intent || 'CAPTURE',
      purchase_units: [{
        reference_id: orderData.reference_id || orderData.checkout_session_id,
        amount: {
          currency_code: orderData.currency || 'USD',
          value: Number(orderData.amount).toFixed(2).toString()
        },
        description: orderData.description || 'Order payment'
      }],
      application_context: {
        return_url: orderData.return_url,
        cancel_url: orderData.cancel_url,
        brand_name: orderData.brand_name || 'VG-Ecommerce',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW'
      }
    };
    
    const response = await fetch(`${PAYPAL_CONFIG.BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': requestId
      },
      body: JSON.stringify(orderPayload)
    });
    
    if (!response.ok) {
      const error = await response.json().catch(async () => ({ message: await response.text() }));
      logError('createPayPalOrder: PayPal order creation failed', null, {
        status: response.status,
        error
      });
      throw new Error(`PayPal order creation failed: ${JSON.stringify(error)}`);
    }
    
    const order = await response.json();
    logger('paypal.order.created', { 
      order_id: order.id, 
      status: order.status,
      request_id: requestId
    });
    return order;
  } catch (err) {
    logError('createPayPalOrder: Error', err, { orderData });
    throw err;
  }
}

/**
 * Capture PayPal Order
 */
export async function capturePayPalOrder(orderId, env) {
  try {
    const clientId = env.PAYPAL_CLIENT_ID;
    const clientSecret = env.PAYPAL_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured');
    }
    
    const accessToken = await getPayPalAccessToken(clientId, clientSecret, env);
    
    const response = await fetch(
      `${PAYPAL_CONFIG.BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    if (!response.ok) {
      const error = await response.json().catch(async () => ({ message: await response.text() }));
      logError('capturePayPalOrder: PayPal capture failed', null, {
        order_id: orderId,
        status: response.status,
        error
      });
      throw new Error(`PayPal capture failed: ${JSON.stringify(error)}`);
    }
    
    const capture = await response.json();
    logger('paypal.order.captured', { 
      order_id: orderId, 
      capture_id: capture.id,
      status: capture.status
    });
    return capture;
  } catch (err) {
    logError('capturePayPalOrder: Error', err, { orderId });
    // throw err;
    return null;
  }
}

/**
 * Get PayPal Order details
 */
export async function getPayPalOrder(orderId, env) {
  try {
    const clientId = env.PAYPAL_CLIENT_ID;
    const clientSecret = env.PAYPAL_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured');
    }
    
    const accessToken = await getPayPalAccessToken(clientId, clientSecret, env);
    
    const response = await fetch(
      `${PAYPAL_CONFIG.BASE_URL}/v2/checkout/orders/${orderId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    if (!response.ok) {
      const error = await response.json().catch(async () => ({ message: await response.text() }));
      logError('getPayPalOrder: PayPal get order failed', null, {
        order_id: orderId,
        status: response.status,
        error
      });
      throw new Error(`PayPal get order failed: ${JSON.stringify(error)}`);
    }
    
    const order = await response.json();
    logger('paypal.order.retrieved', { order_id: orderId, status: order.status });
    return order;
  } catch (err) {
    logError('getPayPalOrder: Error', err, { orderId });
    throw err;
  }
}

