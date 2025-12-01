const express = require('express');
const router = express.Router();
const categoryModel = require('../models/categoryModel');
const { authMiddleware } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.post('/', authMiddleware, requireRole('admin','super_admin'), async (req, res) => {
  const c = await categoryModel.createCategory(req.body);
  res.json(c);
});

router.get('/', async (req, res) => {
  const list = await categoryModel.listCategories();
  res.json(list);
});

module.exports = router;
