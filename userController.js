const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/post");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const getDataUri = require("../utils/dataUri");


const updateProfile = async(req, res) => {
    try {
        const { name, bio } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (name) user.name = name;
        if (bio) user.bio = bio;

        if (req.file) {
            const fileUri = getDataUri(req.file);

            const uploaded = await cloudinary.uploader.upload(fileUri.content);

            user.profilePicture = uploaded.secure_url;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const followUnfollowUser = async(req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);

        if (!userToFollow) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (userToFollow._id.toString() === req.user.id) {
            return res.status(400).json({
                message: "You cannot follow yourself",
            });
        }

        const currentUser = await User.findById(req.user.id);

        const isFollowing = currentUser.following.includes(userToFollow._id);

        if (isFollowing) {
            currentUser.following.pull(userToFollow._id);
            userToFollow.followers.pull(currentUser._id);

            await currentUser.save();
            await userToFollow.save();

            return res.status(200).json({
                message: "User unfollowed successfully",
            });
        }

        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({
            message: "User followed successfully",
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(users);

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const searchUsers = async(req, res) => {
    try {
        const { name } = req.query;

        const users = await User.find({
            name: {
                $regex: name,
                $options: "i",
            },
        }).select("-password");

        res.status(200).json(users);

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("followers", "name profilePicture")
            .populate("following", "name profilePicture");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            user,
            followersCount: user.followers.length,
            followingCount: user.following.length,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const register = async(req, res) => {
    try {
        const { name, email, password } = req.body;


        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields",
            });
        }


        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            user,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password",
            });
        }

        const token = jwt.sign({ id: user._id },
            process.env.JWT_SECRET, { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const profile = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
const saveUnsavePost = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        const isSaved = user.savedPosts.includes(post._id);

        if (isSaved) {
            user.savedPosts = user.savedPosts.filter(
                (id) => id.toString() !== post._id.toString()
            );

            await user.save();

            return res.status(200).json({
                message: "Post unsaved",
                savedPosts: user.savedPosts,
            });
        }

        user.savedPosts.push(post._id);

        await user.save();

        res.status(200).json({
            message: "Post saved",
            savedPosts: user.savedPosts,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
const getSavedPosts = async(req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: "savedPosts",
                populate: {
                    path: "user",
                    select: "name profilePicture",
                },
            });

        res.status(200).json(user.savedPosts);

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

module.exports = {
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
};