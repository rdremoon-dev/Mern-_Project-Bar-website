
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../model/admin.js');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: admin._id }, 'JWT_TOKEN', {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      token,
      admin: { name: admin.name, email: admin.email, avatar: admin.avatar },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: 'Server error during login.' });
  }
});

module.exports = router;
