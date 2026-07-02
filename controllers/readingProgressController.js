const ReadingProgress = require('../models/ReadingProgress');
const { handleEpisodeCompleted } = require('../utils/rewardEngine');

exports.saveProgress = async (req, res) => {
  try {
    const user_id = String(req.user.id || req.user._id);

    const {
      comic_id,
      episode_id,
      current_page,
      total_pages,
    } = req.body;

    const progress_percentage =
      total_pages > 0
        ? Math.floor((current_page / total_pages) * 100)
        : 0;

    const is_completed =
      total_pages > 0 && current_page >= total_pages;

    let progress = await ReadingProgress.findOne({
      user_id,
      episode_id,
    });

    const wasAlreadyCompleted =
      progress ? progress.is_completed : false;

    if (progress) {
      progress.current_page = current_page;
      progress.total_pages = total_pages;
      progress.progress_percentage = progress_percentage;
      progress.is_completed = is_completed;
      progress.last_read_at = new Date();

      await progress.save();
    } else {
      progress = await ReadingProgress.create({
        user_id,
        comic_id,
        episode_id,
        current_page,
        total_pages,
        progress_percentage,
        is_completed,
      });
    }

    let rewardResult = null;

    if (is_completed && !wasAlreadyCompleted) {
      rewardResult = await handleEpisodeCompleted(user_id);
    }

    res.json({
      success: true,
      progress,
      rewards: rewardResult,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to save reading progress',
    });
  }
};

exports.getEpisodeProgress = async (
  req,
  res
) => {
  try {
    const user_id = req.user.id || req.user._id;

    const { episode_id } = req.params;

    const progress =
      await ReadingProgress.findOne({
        user_id,
        episode_id,
      });

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Failed to fetch reading progress',
    });
  }
};

exports.getContinueReading = async (
  req,
  res
) => {
  try {
    const user_id = req.user.id || req.user._id;

    const progress =
      await ReadingProgress.find({
        user_id,
      })
        .populate('comic_id')
        .populate('episode_id')
        .sort({
          last_read_at: -1,
        })
        .limit(20);

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Failed to fetch continue reading',
    });
  }
};