const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

/**
 * POST /api/contacts/sync
 * Body: { contacts: [{ type: "phone" | "discord", value: String }] }
 * Saves the user's synced contacts and returns which ones are on the app.
 */
router.post('/sync', auth, async (req, res) => {
  try {
    const { contacts } = req.body;
    if (!Array.isArray(contacts)) {
      return res.status(400).json({ error: 'contacts must be an array' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.syncedContacts = contacts;
    await user.save();

    // Find which contacts are on the app
    const phoneNumbers = contacts.filter(c => c.type === 'phone').map(c => c.value);
    const discordUsernames = contacts.filter(c => c.type === 'discord').map(c => c.value.toLowerCase());

    const found = await User.find({
      $or: [
        { phoneNumber: { $in: phoneNumbers } },
        { discordUsername: { $in: discordUsernames } },
      ],
      _id: { $ne: user._id },
    }).select('_id username phoneNumber discordUsername');

    res.json({ onApp: found.map(u => ({
      id: u._id,
      username: u.username,
      matchedOn: u.phoneNumber && phoneNumbers.includes(u.phoneNumber) ? 'phone' : 'discord',
    }))});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/contacts/hide/:targetId
 * Hides your profile from a specific user.
 */
router.post('/hide/:targetId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { targetId } = req.params;
    if (!user.hiddenFromUsers.map(id => id.toString()).includes(targetId)) {
      user.hiddenFromUsers.push(targetId);
      await user.save();
    }

    res.json({ hidden: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/contacts/hide/:targetId
 * Unhides your profile from a specific user.
 */
router.delete('/hide/:targetId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.hiddenFromUsers = user.hiddenFromUsers.filter(
      id => id.toString() !== req.params.targetId
    );
    await user.save();

    res.json({ hidden: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/contacts/hidden
 * Returns the list of users you've hidden your profile from.
 */
router.get('/hidden', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('hiddenFromUsers', '_id username');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ hiddenFrom: user.hiddenFromUsers.map(u => ({ id: u._id, username: u.username })) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
