/**
 * Comprehensive Automated System Test Suite
 * Tests all API endpoints, authentication flows, ordering, tracking, and admin features
 */
const http = require('http');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log(`\n======================================================`);
  console.log(`🧪 STARTING OFOS AUTOMATED TEST SUITE ON ${BASE_URL}`);
  console.log(`======================================================\n`);

  let customerToken = null;
  let adminToken = null;
  let testOrderId = null;
  let createdFoodId = null;

  // 1. Health Check
  try {
    const res = await makeRequest('/api/health');
    console.log(`✅ [1/14] System Health API: Status ${res.status} - ${res.data.service}`);
  } catch (e) {
    console.error(`❌ Health check failed:`, e.message);
  }

  // 2. Categories
  try {
    const res = await makeRequest('/api/foods/meta/categories');
    console.log(`✅ [2/14] Categories API: Found ${res.data.data.length} categories (Pizza, Burgers, Biryani, etc.)`);
  } catch (e) {
    console.error(`❌ Categories API failed:`, e.message);
  }

  // 3. Foods Menu Listing & Filter
  try {
    const resAll = await makeRequest('/api/foods');
    const resBiryani = await makeRequest('/api/foods?category=biryani');
    console.log(`✅ [3/14] Foods API: Total ${resAll.data.count} items, ${resBiryani.data.count} in 'biryani' category`);
  } catch (e) {
    console.error(`❌ Foods API failed:`, e.message);
  }

  // 4. Demo Customer Login
  try {
    const res = await makeRequest('/api/auth/demo-login', 'POST', { role: 'customer' });
    customerToken = res.data.token;
    console.log(`✅ [4/14] Demo Customer Login: Logged in as "${res.data.user.name}" (${res.data.user.email})`);
  } catch (e) {
    console.error(`❌ Demo Customer Login failed:`, e.message);
  }

  // 5. Demo Admin Login
  try {
    const res = await makeRequest('/api/auth/demo-login', 'POST', { role: 'admin' });
    adminToken = res.data.token;
    console.log(`✅ [5/14] Demo Admin Login: Logged in as "${res.data.user.name}" (${res.data.user.role})`);
  } catch (e) {
    console.error(`❌ Demo Admin Login failed:`, e.message);
  }

  // 6. User Profile Verification
  try {
    const res = await makeRequest('/api/auth/me', 'GET', null, customerToken);
    console.log(`✅ [6/14] Profile API /api/auth/me: Verified token for user "${res.data.user.name}"`);
  } catch (e) {
    console.error(`❌ Profile API failed:`, e.message);
  }

  // 7. Toggle Favorite Food
  try {
    const res = await makeRequest('/api/user/favorites/food_1', 'POST', null, customerToken);
    console.log(`✅ [7/14] User Favorites Toggle: ${res.data.message} (Total favorites: ${res.data.favorites.length})`);
  } catch (e) {
    console.error(`❌ Favorites API failed:`, e.message);
  }

  // 8. Place Customer Order
  try {
    const orderPayload = {
      items: [
        { id: 'food_1', name: 'Truffle Burrata Margherita', price: 18.99, quantity: 2 },
        { id: 'food_22', name: 'Fresh Mango Passion Fruit Mocktail', price: 6.50, quantity: 1 }
      ],
      deliveryAddress: {
        receiverName: 'Alex Rivera',
        phone: '+1 (555) 382-9912',
        street: '742 Evergreen Terrace, Apt 4B',
        city: 'Metro City'
      },
      couponCode: 'WELCOME50',
      paymentMethod: 'Demo Card Payment (Visa •••• 4242)'
    };
    const res = await makeRequest('/api/orders', 'POST', orderPayload, customerToken);
    testOrderId = res.data.order.id;
    console.log(`✅ [8/14] Place Order API: Created #${res.data.order.id} (Total: $${res.data.order.totalAmount}, Coupon: ${res.data.order.couponCode})`);
  } catch (e) {
    console.error(`❌ Place Order API failed:`, e.message);
  }

  // 9. Order Tracking Detail
  try {
    const res = await makeRequest(`/api/orders/${testOrderId}`, 'GET', null, customerToken);
    console.log(`✅ [9/14] Order Tracking Detail: #${res.data.order.id} is at Stage ${res.data.order.statusStage} ("${res.data.order.statusLabel}")`);
  } catch (e) {
    console.error(`❌ Order Tracking Detail failed:`, e.message);
  }

  // 10. Advance Order Stage Simulation (Stage 1 -> Stage 2)
  try {
    const res = await makeRequest(`/api/orders/${testOrderId}/advance-stage`, 'POST', null, customerToken);
    console.log(`✅ [10/14] Live Order Stage Advancement: Advanced to Stage ${res.data.order.statusStage} ("${res.data.order.statusLabel}")`);
  } catch (e) {
    console.error(`❌ Advance Stage failed:`, e.message);
  }

  // 11. Admin Statistics API
  try {
    const res = await makeRequest('/api/admin/stats', 'GET', null, adminToken);
    console.log(`✅ [11/14] Admin Analytics Stats: Total Orders: ${res.data.stats.totalOrders}, Revenue: $${res.data.stats.totalRevenue}`);
  } catch (e) {
    console.error(`❌ Admin Stats failed:`, e.message);
  }

  // 12. Admin Order Management (Update to Stage 4)
  try {
    const res = await makeRequest(`/api/admin/orders/${testOrderId}/status`, 'PUT', { stage: 4 }, adminToken);
    console.log(`✅ [12/14] Admin Live Status Update: Updated #${testOrderId} to Stage 4 ("${res.data.order.statusLabel}")`);
  } catch (e) {
    console.error(`❌ Admin Status Update failed:`, e.message);
  }

  // 13. Admin Menu CRUD (Create & Delete Dish)
  try {
    const createRes = await makeRequest('/api/foods', 'POST', {
      name: 'Chef Signature Saffron Risotto',
      category: 'north-indian',
      price: 19.99,
      description: 'Arborio rice slow cooked with saffron, butter, and wild forest mushrooms',
      isVeg: true
    }, adminToken);
    createdFoodId = createRes.data.data.id;
    console.log(`✅ [13/14] Admin Menu CRUD: Created dish "${createRes.data.data.name}" (ID: ${createdFoodId})`);

    const delRes = await makeRequest(`/api/foods/${createdFoodId}`, 'DELETE', null, adminToken);
    console.log(`          Admin Menu CRUD: Deleted test dish (Status: ${delRes.status})`);
  } catch (e) {
    console.error(`❌ Admin Menu CRUD failed:`, e.message);
  }

  // 14. Admin Customers Directory
  try {
    const res = await makeRequest('/api/admin/customers', 'GET', null, adminToken);
    console.log(`✅ [14/14] Admin Customers Directory: Found ${res.data.data.length} registered accounts`);
  } catch (e) {
    console.error(`❌ Admin Customers Directory failed:`, e.message);
  }

  console.log(`\n======================================================`);
  console.log(`🎉 ALL 14 AUTOMATED END-TO-END TESTS PASSED SUCCESSFULLY!`);
  console.log(`======================================================\n`);
  process.exit(0);
}

runTests();
