const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const User = require('../models/User');
const auth = require('../middleware/auth');

ffmpeg.setFfmpegPath(ffmpegPath);

// ─── Storage Setup ────────────────────────────────────────────────────────────

const CLIPS_DIR = path.join(__dirname, '../tmp/clips');
const REELS_DIR = path.join(__dirname, '../tmp/reels');
[CLIPS_DIR, REELS_DIR].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(CLIPS_DIR, req.user.id);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir);
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB per clip
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Only video files allowed'));
  },
});

// Pick the best clips if there are too many (max 3 per player)
function selectClips(clips, max = 3) {
  return clips.slice(0, max);
}

// Stitch clips into a single video
function stitchClips(clipPaths, outputPath) {
  return new Promise((resolve, reject) => {
    const listFile = outputPath + '.txt';
    fs.writeFileSync(listFile, clipPaths.map(p => `file '${p}'`).join('\n'));

    ffmpeg()
      .input(listFile)
      .inputOptions(['-f concat', '-safe 0'])
      .outputOptions(['-c copy'])
      .output(outputPath)
      .on('end', () => { fs.unlinkSync(listFile); resolve(); })
      .on('error', (err) => { fs.unlink(listFile, () => {}); reject(err); })
      .run();
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/highlight/upload
 * Upload a gameplay clip. Optionally include game name in body.
 */
router.post('/upload', auth, upload.single('clip'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const clipEntry = {
      path: req.file.path,
      originalName: req.file.originalname,
      game: req.body.game || '',
    };

    user.clips.push(clipEntry);
    await user.save();

    const saved = user.clips[user.clips.length - 1];
    res.json({ clipId: saved._id, originalName: saved.originalName, game: saved.game });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/highlight/clips
 * Returns the current user's uploaded clips.
 */
router.get('/clips', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      clips: user.clips.map(c => ({
        id: c._id,
        originalName: c.originalName,
        game: c.game,
        uploadedAt: c.uploadedAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/highlight/clips/:clipId
 * Delete one of the user's clips.
 */
router.delete('/clips/:clipId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const clip = user.clips.id(req.params.clipId);
    if (!clip) return res.status(404).json({ error: 'Clip not found' });

    fs.unlink(clip.path, () => {});
    user.clips.pull(req.params.clipId);
    await user.save();

    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/highlight/generate/:matchUserId
 * Generates a duo highlight reel between the current user and a match.
 * Both users must have at least 1 clip uploaded.
 */
router.post('/generate/:matchUserId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const match = await User.findById(req.params.matchUserId);

    if (!user || !match) return res.status(404).json({ error: 'User not found' });

    // Verify they are actually matched
    const isMatched = user.matches.map(id => id.toString()).includes(match._id.toString());
    if (!isMatched) return res.status(403).json({ error: 'You are not matched with this user' });

    if (!user.clips.length) return res.status(400).json({ error: 'You have no clips uploaded' });
    if (!match.clips.length) return res.status(400).json({ error: 'Your match has no clips uploaded' });

    // Select best clips (max 3 each)
    const clips1 = selectClips(user.clips);
    const clips2 = selectClips(match.clips);

    // Verify all clip files exist
    const allClips = [...clips1, ...clips2];
    for (const clip of allClips) {
      if (!fs.existsSync(clip.path)) {
        return res.status(400).json({ error: `Clip file missing: ${clip.originalName}` });
      }
    }

    // Stitch clips: user's clips first, then match's clips
    const reelId = `${user._id}_${match._id}_${Date.now()}`;
    const outputPath = path.join(REELS_DIR, `${reelId}.mp4`);
    const clipPaths = allClips.map(c => c.path);

    await stitchClips(clipPaths, outputPath);

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${reelId}.mp4"`);

    const stream = fs.createReadStream(outputPath);
    stream.pipe(res);
    stream.on('end', () => fs.unlink(outputPath, () => {}));
    stream.on('error', () => fs.unlink(outputPath, () => {}));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
