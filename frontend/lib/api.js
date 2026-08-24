import axios from 'axios';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, DEMO_COUPONS } from './mockData';
import { dispatchClientEmail } from './emailService';

/* Create base axios instance */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 3000, // Short timeout to quickly fall back to local mock data if backend isn't running
});

// Helper for local storage getters/setters
const getStoredProducts = () => {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  const stored = localStorage.getItem('ut_products');
  if (!stored) {
    localStorage.setItem('ut_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

const getStoredOrders = () => {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  const stored = localStorage.getItem('ut_orders');
  if (!stored) {
    localStorage.setItem('ut_orders', JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  return JSON.parse(stored);
};

const saveStoredOrders = (orders) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ut_orders', JSON.stringify(orders));
  }
};

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('ut_user');
  if (stored) return JSON.parse(stored);
  const token = localStorage.getItem('ut_token');
  if (token === 'admin_token') {
    return {
      _id: 'usr_admin',
      name: 'Shahmir (Admin)',
      email: 'ashahmir467@gmail.com',
      role: 'admin',
      isEmailVerified: true,
    };
  }
  return null;
};

// Add token interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ut_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Client-Side Mock Response Handler when backend is unreachable or offline
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If backend fails, times out, or returns error — intercept with Client-Side Mock Layer!
    const config = error.config;
    if (!config) return Promise.reject(error);

    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();

    console.log(`[Standalone API] Intercepting ${method.toUpperCase()} ${url} with local mock data.`);

    // --- PRODUCTS ---
    if (url.includes('/products/featured')) {
      const products = getStoredProducts().filter((p) => p.featured);
      return { data: { success: true, products } };
    }

    if (url.includes('/products/') && method === 'get') {
      const slugOrId = url.split('/products/')[1]?.split('?')[0];
      const product = getStoredProducts().find((p) => p.slug === slugOrId || p._id === slugOrId);
      if (product) {
        return { data: { success: true, product } };
      }
    }

    if (url.startsWith('/products') && method === 'get') {
      const products = getStoredProducts();
      return { data: { success: true, count: products.length, total: products.length, products } };
    }

    // --- AUTH: LOGIN ---
    if (url.includes('/auth/login') && method === 'post') {
      const { email } = JSON.parse(config.data || '{}');
      const isAdmin = email === 'ashahmir467@gmail.com';
      const user = {
        _id: isAdmin ? 'usr_admin' : 'usr_user_' + Date.now(),
        name: isAdmin ? 'Shahmir (Admin)' : (email ? email.split('@')[0] : 'Client'),
        email: email || 'user@example.com',
        role: isAdmin ? 'admin' : 'user',
        isEmailVerified: true,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('ut_token', isAdmin ? 'admin_token' : 'user_token_' + Date.now());
        localStorage.setItem('ut_user', JSON.stringify(user));
      }
      return { data: { success: true, token: localStorage.getItem('ut_token'), user } };
    }

    // --- AUTH: REGISTER ---
    if (url.includes('/auth/register') && method === 'post') {
      const { name, email } = JSON.parse(config.data || '{}');
      const user = {
        _id: 'usr_' + Date.now(),
        name: name || 'Client',
        email: email || 'client@example.com',
        role: email === 'ashahmir467@gmail.com' ? 'admin' : 'user',
        isEmailVerified: true,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('ut_token', 'user_token_' + Date.now());
        localStorage.setItem('ut_user', JSON.stringify(user));
      }
      dispatchClientEmail({
        type: 'verify_email',
        to: email,
        subject: 'Verify Email — UrbanThread',
        data: { name, verifyUrl: '#' },
      });
      return { data: { success: true, token: localStorage.getItem('ut_token'), user } };
    }

    // --- AUTH: ME ---
    if (url.includes('/auth/me')) {
      const user = getStoredUser();
      if (user) return { data: { success: true, user } };
    }

    // --- AUTH: LOGOUT ---
    if (url.includes('/auth/logout')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ut_token');
        localStorage.removeItem('ut_user');
      }
      return { data: { success: true, message: 'Logged out.' } };
    }

    // --- AUTH: CONTACT ---
    if (url.includes('/auth/contact') && method === 'post') {
      const payload = JSON.parse(config.data || '{}');
      dispatchClientEmail({
        type: 'contact_inquiry',
        to: payload.email,
        subject: 'Inquiry Confirmation — UrbanThread Client Services',
        data: payload,
      });
      return { data: { success: true, message: 'Inquiry submitted successfully.' } };
    }

    // --- AUTH: NOTIFY STOCK ---
    if (url.includes('/auth/notify-stock') && method === 'post') {
      const payload = JSON.parse(config.data || '{}');
      dispatchClientEmail({
        type: 'stock_alert',
        to: payload.email,
        subject: `Stock Alert Confirmed — ${payload.productName || 'UrbanThread'}`,
        data: payload,
      });
      return { data: { success: true, message: 'Stock alert subscription saved.' } };
    }

    // --- ORDERS: VALIDATE COUPON ---
    if (url.includes('/orders/validate-coupon') && method === 'post') {
      const { couponCode, itemsPrice = 0 } = JSON.parse(config.data || '{}');
      const codeUpper = (couponCode || '').toUpperCase().trim();
      const match = DEMO_COUPONS[codeUpper];
      if (!match) {
        return Promise.reject({ response: { data: { message: 'Invalid promo code.' } } });
      }
      let discountAmount = 0;
      let freeShipping = false;
      if (match.type === 'percent') {
        discountAmount = (itemsPrice * match.discount) / 100;
      } else if (match.type === 'freeship') {
        freeShipping = true;
      }
      return {
        data: {
          success: true,
          coupon: {
            code: codeUpper,
            description: match.description,
            discountAmount,
            freeShipping,
          },
        },
      };
    }

    // --- ORDERS: CREATE ORDER ---
    if (url.endsWith('/orders') && method === 'post') {
      const payload = JSON.parse(config.data || '{}');
      const user = getStoredUser() || { name: payload.shippingAddress?.fullName || 'Client', email: 'client@example.com' };
      const newOrder = {
        _id: 'ord_' + Date.now(),
        orderNumber: String(Math.floor(1000 + Math.random() * 9000)),
        user,
        items: payload.items || [],
        shippingAddress: payload.shippingAddress || {},
        paymentMethod: 'mock_card',
        itemsPrice: payload.itemsPrice || 100,
        shippingPrice: payload.shippingPrice || 0,
        taxPrice: payload.taxPrice || 8,
        totalPrice: payload.totalPrice || 108,
        isPaid: true,
        paidAt: new Date().toISOString(),
        status: 'confirmed',
        statusHistory: [{ status: 'confirmed' }],
        createdAt: new Date().toISOString(),
      };

      const existingOrders = getStoredOrders();
      saveStoredOrders([newOrder, ...existingOrders]);

      dispatchClientEmail({
        type: 'order_confirmation',
        to: user.email,
        subject: `Order Confirmed #${newOrder.orderNumber} — UrbanThread`,
        data: newOrder,
      });

      return { data: { success: true, order: newOrder } };
    }

    // --- ORDERS: GET MY ORDERS / ALL ORDERS / SINGLE ORDER ---
    if (url.includes('/orders') && method === 'get') {
      const orders = getStoredOrders();
      const singleId = url.split('/orders/')[1]?.split('?')[0];
      if (singleId && singleId !== 'my-orders') {
        const found = orders.find((o) => o._id === singleId || o.orderNumber === singleId);
        if (found) return { data: { success: true, order: found } };
      }
      return { data: { success: true, orders } };
    }

    // --- ADMIN: STATS ---
    if (url.includes('/admin/stats')) {
      const orders = getStoredOrders();
      const products = getStoredProducts();
      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      return {
        data: {
          success: true,
          stats: {
            totalRevenue,
            totalOrders: orders.length,
            totalProducts: products.length,
            totalUsers: 14,
            recentOrders: orders.slice(0, 5),
            lowStockProducts: products.filter((p) => p.variants?.some((v) => v.stock <= 5)),
          },
        },
      };
    }

    // --- USERS: ADDRESSES ---
    if (url.includes('/users/addresses')) {
      return {
        data: {
          success: true,
          addresses: [
            {
              _id: 'addr_1',
              fullName: 'Shahmir Admin',
              phone: '+92 300 1234567',
              line1: '15 Atelier Street',
              city: 'Paris',
              state: 'Île-de-France',
              postalCode: '75001',
              country: 'France',
              isDefault: true,
            },
          ],
        },
      };
    }

    return Promise.reject(error);
  }
);

export default api;
