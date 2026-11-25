const express = require('express');
const router = express.Router();
const { orders, coupons, foods } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

/**
 * POST /api/orders
 * Create new order
 */
router.post('/', authenticateToken, (req, res) => {
  try {
    const { items, deliveryAddress, couponCode, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty. Please add items to place an order.' });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city) {
      return res.status(400).json({ success: false, message: 'Please provide a valid delivery address.' });
    }

    // Calculate subtotal from database or provided items
    let subtotal = 0;
    const validatedItems = items.map(item => {
      const dbFood = foods.findById(item.id);
      const price = dbFood ? dbFood.price : Number(item.price);
      const quantity = Math.max(1, parseInt(item.quantity) || 1);
      subtotal += price * quantity;
      return {
        id: item.id,
        name: dbFood ? dbFood.name : item.name,
        price: price,
        quantity: quantity,
        image: dbFood ? dbFood.image : item.image
      };
    });

    // Delivery fee ($2.99 unless above $40 or free coupon)
    let deliveryFee = subtotal >= 40 ? 0.00 : 2.99;

    // Apply Coupon if given
    let discountAmount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = coupons.findByCode(couponCode);
      if (coupon) {
        if (!coupon.minOrder || subtotal >= coupon.minOrder) {
          appliedCoupon = coupon.code;
          if (coupon.freeDelivery) {
            deliveryFee = 0;
          }
          if (coupon.discountPercent) {
            discountAmount = (subtotal * coupon.discountPercent) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          }
        }
      }
    }

    // Taxes (5% GST/Sales tax)
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(taxableAmount * 0.05 * 100) / 100;
    const totalAmount = Math.round((taxableAmount + deliveryFee + taxAmount) * 100) / 100;

    const newOrder = orders.create({
      userId: req.user.id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone || deliveryAddress.phone,
      items: validatedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      couponCode: appliedCoupon,
      deliveryFee,
      taxAmount,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || 'Demo Card Payment'
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to place order: ' + err.message });
  }
});

/**
 * GET /api/orders
 * Get logged-in user's orders
 */
router.get('/', authenticateToken, (req, res) => {
  const userOrders = orders.findAll({ userId: req.user.id });
  return res.json({ success: true, count: userOrders.length, data: userOrders });
});

/**
 * GET /api/orders/:id
 * Get specific order tracking details
 */
router.get('/:id', authenticateToken, (req, res) => {
  const order = orders.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  // Allow order owner or admin
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized to view this order.' });
  }

  return res.json({ success: true, order });
});

/**
 * POST /api/orders/:id/advance-stage
 * Testing & simulation helper: advance order status stage 1 -> 2 -> 3 -> 4 -> 5
 */
router.post('/:id/advance-stage', authenticateToken, (req, res) => {
  const order = orders.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const nextStage = Math.min(5, (order.statusStage || 1) + 1);
  const updated = orders.updateStatus(order.id, nextStage);

  return res.json({
    success: true,
    message: `Order stage updated to Stage ${nextStage}: ${updated.statusLabel}`,
    order: updated
  });
});

module.exports = router;
