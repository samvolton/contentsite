const router = require('express').Router();
const Content = require('../models/content.model');

router.get('/', async (req, res) => {
  try {
    const content = await Content.find();
    res.json(content);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching content', error: error.message });
  }
});

router.get('/:type', async (req, res) => {
  try {
    const content = await Content.find({ type: req.params.type });
    res.json(content);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching content', error: error.message });
  }
});

module.exports = router;