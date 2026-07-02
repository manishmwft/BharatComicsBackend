const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
  saveProgress,
  getEpisodeProgress,
  getContinueReading,
} = require('../controllers/readingProgressController');

router.post(
  '/save',
  authMiddleware,
  saveProgress
);

router.get(
  '/episode/:episode_id',
  authMiddleware,
  getEpisodeProgress
);

router.get(
  '/continue-reading',
  authMiddleware,
  getContinueReading
);

module.exports = router;