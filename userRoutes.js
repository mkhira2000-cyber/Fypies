const express = require("express");
const router = express.Router();

const {
    register,
    login,
    profile,
    updateProfile,
    followUnfollowUser,
    getAllUsers,
    searchUsers,
    getUserById,
    saveUnsavePost,
    getSavedPosts,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Authentication
router.post("/register", register);
router.post("/login", login);

// Current user profile
router.get("/profile", authMiddleware, profile);
router.put(
    "/profile",
    authMiddleware,
    upload.single("profilePicture"),
    updateProfile
);

router.get("/", authMiddleware, getAllUsers);
router.get("/search", authMiddleware, searchUsers);
router.get(
    "/saved",
    authMiddleware,
    getSavedPosts
);

router.put(
    "/save/:postId",
    authMiddleware,
    saveUnsavePost
);

router.put("/:id/follow", authMiddleware, followUnfollowUser);

router.get("/:id", authMiddleware, getUserById);

module.exports = router;