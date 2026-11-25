/**
 * Store Admin Dashboard Controller
 * Handles Analytics Charts, Live Order Stage Management,
 * Food Menu CRUD, and Customer Directory
 */

document.addEventListener('DOMContentLoaded', async () => {
  let currentUser = null;
  let revenueChartInstance = null;
  let categoryChartInstance = null;

  // Verify Admin Access Role
  try {
    const res = await API.getCurrentUser();
    currentUser = res.user;
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Access Denied: Administrator role required to access Store Admin.');
      window.location.href = '/dashboard.html';
      return;
    }
  } catch (err) {
    window.location.href = '/index.html';
    return;
  }

  // Set user details
  document.getElementById('admin-name-val').textContent = currentUser.name;
  document.getElementById('btn-admin-logout').addEventListener('click', () => API.logout());

  // Tab Navigation Handling
  const navItems = document.querySelectorAll('.admin-nav-item');
  const tabPanes = document.querySelectorAll('.admin-tab-pane');
  const adminViewTitle = document.getElementById('admin-view-title');

  const titles = {
    'tab-overview': 'Executive Sales Overview',
    'tab-orders': 'Live Order Management',
    'tab-foods': 'Menu Items & Inventory',
    'tab-customers': 'Customer Accounts Directory'
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      navItems.forEach(n => n.classList.remove('active'));
      tabPanes.forEach(p => p.style.display = 'none');

      item.classList.add('active');
      const pane = document.getElementById(targetTab);
      if (pane) pane.style.display = 'block';

      adminViewTitle.textContent = titles[targetTab] || 'Admin Panel';

      // Load specific tab data
      if (targetTab === 'tab-overview') loadOverview();
      else if (targetTab === 'tab-orders') loadOrders();
      else if (targetTab === 'tab-foods') loadFoods();
      else if (targetTab === 'tab-customers') loadCustomers();
    });
  });

  // 1. Overview & Analytics Tab
  async function loadOverview() {
    try {
      const res = await API.getAdminStats();
      const { stats } = res;

      document.getElementById('stat-revenue-val').textContent = `$${stats.totalRevenue.toFixed(2)}`;
      document.getElementById('stat-orders-val').textContent = stats.totalOrders;
      document.getElementById('stat-pending-val').textContent = stats.pendingOrders;
      document.getElementById('stat-completed-val').textContent = stats.completedOrders;
      document.getElementById('stat-customers-val').textContent = stats.totalCustomers;
      document.getElementById('stat-foods-val').textContent = stats.totalFoods;

      // Revenue Trend Chart
      if (stats.revenueTrend && window.Chart) {
        const ctxRev = document.getElementById('revenueTrendChart').getContext('2d');
        if (revenueChartInstance) revenueChartInstance.destroy();

        revenueChartInstance = new Chart(ctxRev, {
          type: 'line',
          data: {
            labels: stats.revenueTrend.map(d => d.date),
            datasets: [{
              label: 'Daily Revenue ($)',
              data: stats.revenueTrend.map(d => d.revenue),
              borderColor: '#FF5722',
              backgroundColor: 'rgba(255, 87, 34, 0.15)',
              borderWidth: 3,
              fill: true,
              tension: 0.35,
              pointBackgroundColor: '#FF9800',
              pointRadius: 5
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { labels: { color: '#94A3B8' } }
            },
            scales: {
              x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
              y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
          }
        });
      }

      // Category Distribution Chart
      if (stats.categoryDistribution && window.Chart) {
        const ctxCat = document.getElementById('categoryDistChart').getContext('2d');
        if (categoryChartInstance) categoryChartInstance.destroy();

        const catLabels = Object.keys(stats.categoryDistribution);
        const catValues = Object.values(stats.categoryDistribution);

        categoryChartInstance = new Chart(ctxCat, {
          type: 'doughnut',
          data: {
            labels: catLabels.map(c => c.toUpperCase()),
            datasets: [{
              data: catValues,
              backgroundColor: [
                '#FF5722', '#FF9800', '#F59E0B', '#10B981',
                '#3B82F6', '#8B5CF6', '#EC4899', '#6366F1'
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
                labels: { color: '#94A3B8', boxWidth: 12 }
              }
            }
          }
        });
      }

    } catch (err) {
      Toast.error('Failed to load admin stats: ' + err.message);
    }
  }

  // 2. Orders Management Tab
  const adminOrdersTbody = document.getElementById('admin-orders-tbody');
  const adminOrderFilterStatus = document.getElementById('admin-order-filter-status');

  adminOrderFilterStatus.addEventListener('change', () => loadOrders());

  async function loadOrders() {
    try {
      const status = adminOrderFilterStatus.value;
      const res = await API.getAdminOrders(status);
      const ordersList = res.data || [];

      adminOrdersTbody.innerHTML = '';
      if (ordersList.length === 0) {
        adminOrdersTbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">
              No orders found for selected filter.
            </td>
          </tr>
        `;
        return;
      }

      ordersList.forEach(order => {
        const tr = document.createElement('tr');
        const itemsSummary = (order.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ');

        tr.innerHTML = `
          <td><strong style="color: #FF7043;">#${order.id}</strong></td>
          <td>
            <div style="font-weight: 700;">${order.customerName}</div>
            <div style="font-size: 12px; color: var(--text-muted);">${order.customerEmail}</div>
          </td>
          <td style="max-width: 250px; font-size: 13px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemsSummary}">
            ${itemsSummary}
          </td>
          <td style="font-weight: 800; color: #FFF;">$${order.totalAmount.toFixed(2)}</td>
          <td>
            <span class="badge ${order.statusStage === 5 ? 'badge-success' : 'badge-warning'}">
              Stage ${order.statusStage}: ${order.statusLabel}
            </span>
          </td>
          <td>
            <select class="status-stage-select" onchange="window.adminChangeOrderStage('${order.id}', this.value)">
              <option value="1" ${order.statusStage === 1 ? 'selected' : ''}>1. Order Placed</option>
              <option value="2" ${order.statusStage === 2 ? 'selected' : ''}>2. Restaurant Accepted</option>
              <option value="3" ${order.statusStage === 3 ? 'selected' : ''}>3. Food Preparing</option>
              <option value="4" ${order.statusStage === 4 ? 'selected' : ''}>4. Out for Delivery</option>
              <option value="5" ${order.statusStage === 5 ? 'selected' : ''}>5. Delivered</option>
            </select>
          </td>
          <td style="font-size: 12px; color: var(--text-muted);">
            ${new Date(order.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </td>
        `;
        adminOrdersTbody.appendChild(tr);
      });
    } catch (err) {
      Toast.error('Failed to load orders: ' + err.message);
    }
  }

  window.adminChangeOrderStage = async function(orderId, stage) {
    try {
      const res = await API.updateOrderStatus(orderId, stage);
      Toast.success(res.message);
      loadOrders();
    } catch (err) {
      Toast.error('Failed to update status: ' + err.message);
    }
  };

  // 3. Menu Foods CRUD Tab
  const adminFoodsTbody = document.getElementById('admin-foods-tbody');
  const btnOpenAddFood = document.getElementById('btn-open-add-food');
  const addFoodModal = document.getElementById('add-food-modal');
  const closeAddFoodModal = document.getElementById('close-add-food-modal');
  const btnCancelAddFood = document.getElementById('btn-cancel-add-food');
  const btnSaveNewFood = document.getElementById('btn-save-new-food');

  btnOpenAddFood.addEventListener('click', () => addFoodModal.classList.add('active'));
  closeAddFoodModal.addEventListener('click', () => addFoodModal.classList.remove('active'));
  btnCancelAddFood.addEventListener('click', () => addFoodModal.classList.remove('active'));

  async function loadFoods() {
    try {
      const res = await API.getFoods();
      const foodsList = res.data || [];

      adminFoodsTbody.innerHTML = '';
      foodsList.forEach(food => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${food.image}" alt="${food.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;">
              <div>
                <strong style="color: #FFF;">${food.name}</strong>
                <div style="font-size: 12px; color: var(--text-muted);">${food.prepTime} &bull; ${food.restaurantName || 'House Kitchen'}</div>
              </div>
            </div>
          </td>
          <td><span class="badge badge-primary" style="text-transform: capitalize;">${food.category}</span></td>
          <td style="font-weight: 800; color: #FFF;">$${food.price.toFixed(2)}</td>
          <td>
            <span class="badge ${food.isVeg ? 'badge-success' : 'badge-warning'}">
              ${food.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
          </td>
          <td style="color: #FBBF24; font-weight: 700;">★ ${food.rating}</td>
          <td>
            <button class="btn btn-secondary btn-sm" style="color: #EF4444;" onclick="window.adminDeleteFood('${food.id}')">
              <i class="fa-regular fa-trash-can"></i> Delete
            </button>
          </td>
        `;
        adminFoodsTbody.appendChild(tr);
      });
    } catch (err) {
      Toast.error('Failed to load menu: ' + err.message);
    }
  }

  window.adminDeleteFood = async function(foodId) {
    if (!confirm('Are you sure you want to remove this food item from the menu?')) return;
    try {
      await API.deleteFood(foodId);
      Toast.success('Dish removed from menu.');
      loadFoods();
    } catch (err) {
      Toast.error('Failed to delete dish: ' + err.message);
    }
  };

  btnSaveNewFood.addEventListener('click', async () => {
    const name = document.getElementById('food-form-name').value.trim();
    const category = document.getElementById('food-form-category').value;
    const price = parseFloat(document.getElementById('food-form-price').value);
    const description = document.getElementById('food-form-desc').value.trim();
    const image = document.getElementById('food-form-img').value.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
    const isVeg = document.getElementById('food-form-veg').checked;

    if (!name || isNaN(price) || price <= 0) {
      Toast.error('Please enter a valid dish name and price.');
      return;
    }

    try {
      await API.createFood({
        name,
        category,
        price,
        description,
        image,
        isVeg,
        prepTime: '15-20 min',
        restaurantName: 'Artisan Kitchen'
      });

      addFoodModal.classList.remove('active');
      Toast.success(`Added "${name}" to the menu!`);
      loadFoods();
    } catch (err) {
      Toast.error('Failed to create dish: ' + err.message);
    }
  });

  // 4. Customers Directory Tab
  const adminCustomersTbody = document.getElementById('admin-customers-tbody');

  async function loadCustomers() {
    try {
      const res = await API.getAdminCustomers();
      const customersList = res.data || [];

      adminCustomersTbody.innerHTML = '';
      customersList.forEach(cust => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${cust.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;">
              <strong style="color: #FFF;">${cust.name}</strong>
            </div>
          </td>
          <td>${cust.email}</td>
          <td style="color: var(--text-secondary);">${cust.phone || 'N/A'}</td>
          <td>
            <span class="badge ${cust.role === 'admin' ? 'badge-warning' : 'badge-primary'}" style="text-transform: capitalize;">
              ${cust.role}
            </span>
          </td>
          <td style="font-weight: 700; color: #FFF;">${cust.ordersCount} orders</td>
          <td style="font-size: 12px; color: var(--text-muted);">${new Date(cust.createdAt).toLocaleDateString()}</td>
        `;
        adminCustomersTbody.appendChild(tr);
      });
    } catch (err) {
      Toast.error('Failed to load customers: ' + err.message);
    }
  }

  // Load initial view
  loadOverview();
});
