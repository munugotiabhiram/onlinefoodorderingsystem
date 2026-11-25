const express = require('express');
const router = express.Router();
const { users } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/user/profile
 */
router.get('/profile', authenticateToken, (req, res) => {
  const user = users.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.json({ success: true, user });
});

/**
 * PUT /api/user/profile
 * Update editable profile details
 */
router.put('/profile', authenticateToken, (req, res) => {
  const { name, phone } = req.body;
  const updates = {};
  if (name && name.trim()) updates.name = name.trim();
  if (phone !== undefined) updates.phone = phone.trim();

  const updatedUser = users.update(req.user.id, updates);
  return res.json({
    success: true,
    message: 'Profile updated successfully!',
    user: updatedUser
  });
});

/**
 * POST /api/user/addresses
 * Add delivery address
 */
router.post('/addresses', authenticateToken, (req, res) => {
  const { label, receiverName, phone, street, city, state, zip, isDefault } = req.body;
  if (!street || !city || !receiverName) {
    return res.status(400).json({ success: false, message: 'Receiver name, street address, and city are required.' });
  }

  const user = users.findById(req.user.id);
  const addresses = user.addresses || [];

  if (isDefault) {
    addresses.forEach(a => a.isDefault = false);
  }

  const newAddress = {
    id: `addr_${Date.now()}`,
    label: label || 'Home',
    receiverName,
    phone: phone || user.phone || '',
    street,
    city,
    state: state || '',
    zip: zip || '',
    isDefault: isDefault !== undefined ? Boolean(isDefault) : (addresses.length === 0)
  };

  addresses.push(newAddress);
  users.update(user.id, { addresses });

  return res.status(201).json({
    success: true,
    message: 'Address added successfully!',
    addresses
  });
});

/**
 * DELETE /api/user/addresses/:addressId
 */
router.delete('/addresses/:addressId', authenticateToken, (req, res) => {
  const user = users.findById(req.user.id);
  let addresses = (user.addresses || []).filter(a => a.id !== req.params.addressId);
  users.update(user.id, { addresses });

  return res.json({
    success: true,
    message: 'Address removed successfully!',
    addresses
  });
});

/**
 * POST /api/user/favorites/:foodId
 * Toggle favorite dish
 */
router.post('/favorites/:foodId', authenticateToken, (req, res) => {
  const user = users.findById(req.user.id);
  let favorites = [...(user.favorites || [])];
  const foodId = req.params.foodId;

  const index = favorites.indexOf(foodId);
  let isFavorite = false;
  if (index === -1) {
    favorites.push(foodId);
    isFavorite = true;
  } else {
    favorites.splice(index, 1);
    isFavorite = false;
  }

  users.update(user.id, { favorites });
  return res.json({
    success: true,
    isFavorite,
    favorites,
    message: isFavorite ? 'Added to favorites!' : 'Removed from favorites.'
  });
});

module.exports = router;
