const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const productModel = require('../models/productModel');

router.post('/', authMiddleware, requireRole('admin','super_admin'), async (req, res) => {
  const p = await productModel.createProduct(req.body);
  res.json(p);
});

router.get('/', async (req, res) => {
  const list = await productModel.listProducts();
  res.json(list);
});

router.get('/:id', async (req, res) => {
  const p = await productModel.getProduct(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

router.put('/:id', authMiddleware, requireRole('admin','super_admin'), async (req, res) => {
  const p = await productModel.updateProduct(req.params.id, req.body);
  res.json(p);
});

router.delete('/:id', authMiddleware, requireRole('admin','super_admin'), async (req, res) => {
  await productModel.deleteProduct(req.params.id);
  res.json({ success: true });
});

module.exports = router;
