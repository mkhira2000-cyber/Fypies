const express = require("express");
const router = express.Router();

const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
    deleteComment,
    getFeed,
    getUserPosts,
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    createPost
);

router.get("/", getPosts);

router.get(
    "/feed",
    authMiddleware,
    getFeed
);

router.get(
    "/user/:id",
    authMiddleware,
    getUserPosts
);

router.get("/:id", getPostById);

router.put(
    "/:id",
    authMiddleware,
    updatePost
);

router.delete(
    "/:id",
    authMiddleware,
    deletePost
);

router.put(
    "/:id/like",
    authMiddleware,
    toggleLike
);

router.post(
    "/:id/comment",
    authMiddleware,
    addComment
);

router.delete(
    "/:postId/comment/:commentId",
    authMiddleware,
    deleteComment
);

module.exports = router;