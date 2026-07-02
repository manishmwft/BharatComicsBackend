const express = require("express");
const router = express.Router();
const adminAnalyticsController =
require("../controllers/adminAnalyticsController");
const upload = require("../middleware/uploadMiddleware");
const optimizeUploadedImages = require("../middleware/optimizeUploadMiddleware");
const adminRevenueController = require("../controllers/adminRevenueController");

const adminCoinPackageController =
require("../controllers/adminCoinPackageController");

const admin = require("../controllers/adminController");
const adminAuthController = require("../controllers/adminAuthController");
const adminAuth = require("../middleware/adminAuth");
const adminUserController = require("../controllers/adminUserController");

const {
  adminLoginLimiter,
} = require("../middleware/rateLimiters");

/* ================= ADMIN AUTH ================= */

router.get("/login", adminAuthController.loginPage);
router.post("/login", adminLoginLimiter, adminAuthController.login);
router.get("/logout", adminAuthController.logout);

/* ================= PROTECTED ADMIN ROUTES ================= */

router.use(adminAuth);

router.get("/dashboard", admin.dashboard);

/* ================= COMICS ================= */

router.get("/comics", admin.comicsList);
router.get("/comics/add", admin.comicForm);

router.post(
  "/comics/add",
  upload.single("thumbnail"),
  optimizeUploadedImages,
  admin.createComic
);

router.get(
  "/analytics/trending",
  adminAnalyticsController.trendingPage
);

router.get(
  "/analytics/episodes",
  adminAnalyticsController.episodePage
);
router.get(
  "/users",
  adminUserController.usersList
);
router.get(
  "/users/:id",
  adminUserController.userDetails
);

router.post(
  "/users/:id/coins",
  adminUserController.adjustCoins
);
router.get(
  "/analytics/genres",
  adminAnalyticsController.genrePage
);

router.get(
  "/analytics/activity",
  adminAnalyticsController.activityPage
);

router.get("/comics/edit/:id", admin.comicForm);

router.post(
  "/comics/edit/:id",
  upload.single("thumbnail"),
  optimizeUploadedImages,
  admin.updateComic
);

router.get("/comics/delete/:id", admin.deleteComic);

/* ================= EPISODES ================= */

router.get("/episodes/:comic_id", admin.episodesList);
router.get("/episodes/add/:comic_id", admin.episodeForm);

router.post(
  "/episodes/add/:comic_id",
  upload.single("episode_cover"),
  optimizeUploadedImages,
  admin.createEpisode
);

router.get("/episodes/edit/:id", admin.episodeForm);

router.post(
  "/episodes/edit/:id",
  upload.single("episode_cover"),
  optimizeUploadedImages,
  admin.updateEpisode
);

router.get("/episodes/delete/:id", admin.deleteEpisode);

/* ================= PAGES ================= */

router.get("/pages/:episode_id", admin.pagesList);
router.get("/pages/add/:episode_id", admin.pageForm);

router.post(
  "/pages/add/:episode_id",
  upload.array("page_images", 100),
  optimizeUploadedImages,
  admin.createPage
);

router.get("/pages/edit/:id", admin.pageForm);

router.post(
  "/pages/edit/:id",
  upload.single("page_image"),
  optimizeUploadedImages,
  admin.updatePage
);

router.get("/pages/delete/:id", admin.deletePage);

// =============================
// COIN PACKAGES
// =============================

router.get(
  "/coin-packages",
  adminCoinPackageController.index
);

router.get(
  "/coin-packages/add",
  adminCoinPackageController.form
);

router.post(
  "/coin-packages/add",
  adminCoinPackageController.create
);

router.get(
  "/coin-packages/edit/:id",
  adminCoinPackageController.form
);

router.post(
  "/coin-packages/edit/:id",
  adminCoinPackageController.update
);

router.post(
  "/coin-packages/delete/:id",
  adminCoinPackageController.remove
);

router.get(
  "/revenue",
  adminRevenueController.index
);

module.exports = router;