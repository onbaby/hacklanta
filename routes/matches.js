const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { rankCandidates } = require('../algorithms/matchScore');
const auth = require('../middleware/auth');

/**
 * GET /api/matches/feed
 * Returns ranked candidates for the swipe feed.
 * Excludes people the user already swiped on and themselves.
 */
router.get('/feed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const excluded = new Set([
      user._id.toString(),
      ...user.swipedRight.map(id => id.toString()),
      ...user.swipedLeft.map(id => id.toString()),
      ...user.matches.map(id => id.toString()),
    ]);

    const candidates = await User.find({
      _id: { $nin: [...excluded] },
    });

    const ranked = rankCandidates(user, candidates);

    res.json({
      feed: ranked.map(({ candidate, total, breakdown }) => ({
        user: formatProfile(candidate),
        score: total,
        breakdown,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/matches/swipe
 * Body: { targetId, direction: "right" | "left" }
 * If both users swiped right on each other, they become a match.
 */
router.post('/swipe', auth, async (req, res) => {
  try {
    const { targetId, direction } = req.body;
    if (!targetId || !['left', 'right'].includes(direction)) {
      return res.status(400).json({ error: 'Invalid swipe data' });
    }

    const user = await User.findById(req.user.id);
    const target = await User.findById(targetId);
    if (!user || !target) return res.status(404).json({ error: 'User not found' });

    // Record the swipe
    if (direction === 'right') {
      if (!user.swipedRight.includes(targetId)) user.swipedRight.push(targetId);

      // Check if it's a mutual match
      const isMutual = target.swipedRight.some(id => id.toString() === user._id.toString());
      if (isMutual) {
        if (!user.matches.includes(targetId)) user.matches.push(targetId);
        if (!target.matches.includes(user._id)) target.matches.push(user._id);
        await target.save();
        await user.save();
        return res.json({ matched: true, with: formatProfile(target) });
      }
    } else {
      if (!user.swipedLeft.includes(targetId)) user.swipedLeft.push(targetId);
    }

    await user.save();
    res.json({ matched: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/matches
 * Returns all mutual matches for the current user.
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('matches');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ matches: user.matches.map(formatProfile) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Strip sensitive fields before sending to client
function formatProfile(user) {
  return {
    id: user._id,
    username: user.username,
    age: user.birthday ? getAge(user.birthday) : null,
    gender: user.gender,
    ethnicity: user.ethnicity,
    bio: user.bio,
    region: user.region,
    playStyle: user.playStyle,
    schedule: user.schedule,
    hasMic: user.hasMic,
    isOnline: user.isOnline,
    games: user.games,
  };
}

function getAge(birthday) {
  const today = new Date();
  const birth = new Date(birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

module.exports = router;
