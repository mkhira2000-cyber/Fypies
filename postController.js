const Post = require("../models/post");
console.log(Post);

const cloudinary = require("../config/cloudinary");
const getDataUri = require("../utils/dataUri");
const User = require("../models/User");

const createPost = async(req, res) => {
    try {
        console.log("Content-Type:", req.headers["content-type"]);
        console.log("body:", req.body);
        console.log("file:", req.file);

        const { text } = req.body;
        let imageUrl = "";

        if (req.file) {
            const fileUri = getDataUri(req.file);

            const uploaded = await cloudinary.uploader.upload(fileUri.content);

            imageUrl = uploaded.secure_url;
        }

        const post = await Post.create({
            user: req.user.id,
            text,
            image: imageUrl,
        });

        await post.populate("user", "name email");

        res.status(201).json({
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({
            message: error.message,
            error,
        });
    }
};

const getPosts = async(req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name email _id")
            .populate("comments.user", "_id name email")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getPostById = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate(
                "user",
                "name email"
            )
            .populate("comments.user", "_id name email");

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updatePost = async(req, res) => {
    try {
        const { text, image } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        post.text = text || post.text;
        post.image = image || post.image;

        await post.save();

        res.status(200).json({
            message: "Post updated successfully",
            post,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deletePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        await post.deleteOne();

        res.status(200).json({
            message: "Post deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const toggleLike = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        const userId = req.user.id;

        const liked = post.likes.some(
            (id) => id.toString() === userId
        );

        if (liked) {
            post.likes = post.likes.filter(
                (id) => id.toString() !== userId
            );

            await post.save();

            return res.status(200).json({
                message: "Post unliked",
                likes: post.likes,
            });
        }

        post.likes.push(userId);

        await post.save();

        res.status(200).json({
            message: "Post liked",
            likes: post.likes,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const addComment = async(req, res) => {
    try {
        const { text } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        const comment = {
            user: req.user.id,
            text,
        };

        post.comments.push(comment);

        await post.save();

        await post.populate("comments.user", "name email");

        res.status(201).json({
            message: "Comment added successfully",
            comments: post.comments,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteComment = async(req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        const comment = post.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        comment.deleteOne();

        await post.save();

        res.status(200).json({
            message: "Comment deleted successfully",
            comments: post.comments,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getFeed = async(req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);

        const posts = await Post.find({
                user: {
                    $in: [...currentUser.following, currentUser._id],
                },
            })
            .populate("user", "_id name profilePicture")
            .populate("comments.user", "_id name email")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const getUserPosts = async(req, res) => {
    try {
        const posts = await Post.find({
                user: req.params.id,
            })
            .populate("user", "_id name profilePicture")
            .populate("comments.user", "_id name email")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
module.exports = {
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
};