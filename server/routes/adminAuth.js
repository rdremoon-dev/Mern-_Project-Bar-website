
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../model/admin.js');

const authenticateAdmin = (req, res, next) => {
  const authorization = req.get('authorization') || '';
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: 'Admin authentication is required.' });
  }

  if (!process.env.JWT_TOKEN) {
    console.error('JWT_TOKEN is not configured.');
    return res.status(500).json({
      success: false,
      error: 'Admin authentication is not configured on the server.',
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_TOKEN);
    if (typeof payload === 'string' || typeof payload.id !== 'string') {
      return res
        .status(401)
        .json({ success: false, error: 'Invalid admin session.' });
    }

    req.adminId = payload.id;
    return next();
  } catch {
    return res
      .status(401)
      .json({ success: false, error: 'Invalid or expired admin session.' });
  }
};

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

    if (!process.env.JWT_TOKEN) {
      console.error('JWT_TOKEN is not configured.');
      return res.status(500).json({
        success: false,
        error: 'Admin authentication is not configured on the server.',
      });
    }

    const token = jwt.sign({ id: admin._id.toString() }, process.env.JWT_TOKEN, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      token,
      admin: { name: admin.name, email: admin.email, avatar: admin.avatar },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res
      .status(500)
      .json({ success: false, error: 'Server error during login.' });
  }
});

router.put('/profile', authenticateAdmin, async (req, res) => {
  const avatarMatch =
    typeof req.body?.avatar === 'string'
      ? req.body.avatar.match(
          /^data:image\/(?:png|jpe?g|webp|gif);base64,([A-Za-z0-9+/]+={0,2})$/,
        )
      : null;

  if (!avatarMatch) {
    return res.status(400).json({
      success: false,
      error: 'Choose a PNG, JPEG, WebP, or GIF image.',
    });
  }

  if (Buffer.from(avatarMatch[1], 'base64').length > 2 * 1024 * 1024) {
    return res.status(413).json({
      success: false,
      error: 'The profile image must be 2 MB or smaller.',
    });
  }

  try {
    const admin = await Admin.findByIdAndUpdate(
      req.adminId,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    ).select('name email avatar');

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, error: 'Admin account not found.' });
    }

    return res.json({
      success: true,
      admin: { name: admin.name, email: admin.email, avatar: admin.avatar },
    });
  } catch (error) {
    console.error('Admin profile update error:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to save the profile image.' });
  }
});

module.exports = router;
