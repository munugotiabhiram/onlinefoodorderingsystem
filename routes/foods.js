const express = require('express');
const router = express.Router();
const { foods, categories, restaurants, coupons } = require('../db/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * GET /api/foods
 * Query params: search, category, sort, vegOnly, maxPrice
 */
router.get('/', (req, res) => {
  try {
    const list = foods.findAll(req.query);
    return res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve food items: ' + err.message });
  }
});

/**
 * GET /api/foods/categories
 */
router.get('/meta/categories', (req, res) => {
  return res.json({ success: true, data: categories.findAll() });
});

/**
 * GET /api/foods/restaurants
 */
router.get('/meta/restaurants', (req, res) => {
  return res.json({ success: true, data: restaurants.findAll() });
});

/**
 * GET /api/foods/coupons
 */
router.get('/meta/coupons', (req, res) => {
  return res.json({ success: true, data: coupons.findAll() });
});

/**
 * GET /api/foods/:id
 */
router.get('/:id', (req, res) => {
  const item = foods.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Food item not found' });
  }
  return res.json({ success: true, data: item });
});

/**
 * POST /api/foods - Add new food (Admin only)
 */
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const { name, category, price, description, image, isVeg, prepTime, restaurantName } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: 'Name, category, and price are required.' });
  }

  const newFood = foods.create({
    name,
    category,
    price,
    description,
    image,
    isVeg,
    prepTime,
    restaurantName,
    rating: 4.8,
    reviewsCount: 1,
    isAvailable: true
  });

  return res.status(201).json({ success: true, message: 'Food item added successfully', data: newFood });
});

/**
 * PUT /api/foods/:id - Update food (Admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const updated = foods.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Food item not found' });
  }
  return res.json({ success: true, message: 'Food item updated', data: updated });
});

/**
 * DELETE /api/foods/:id - Delete food (Admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const deleted = foods.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Food item not found' });
  }
  return res.json({ success: true, message: 'Food item deleted successfully' });
});

module.exports = router;
