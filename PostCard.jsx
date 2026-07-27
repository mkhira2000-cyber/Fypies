import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import CommentSection from "./CommentSection";

function PostCard({ post, onUpdatePost, onDeletePost }) {
    const { user } = useAuth();

    const [likes, setLikes] = useState(post.likes || []);
    const [editing, setEditing] = useState(false);
    const [editedText, setEditedText] = useState(post.text);

    const isLiked = likes.includes(user?._id);
    const isOwner = post.user?._id === user?._id;

    const handleLike = async () => {
        try {
            const res = await api.put(`/posts/${post._id}/like`);
            setLikes(res.data.likes);
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    const handleSave = async () => {
        try {
            await api.put(`/users/save/${post._id}`);
            alert("Post saved successfully ❤️");
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await api.put(`/posts/${post._id}`, {
                text: editedText,
            });

            onUpdatePost(res.data.post);
            setEditing(false);
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this post?")) return;

        try {
            await api.delete(`/posts/${post._id}`);
            onDeletePost(post._id);
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    return (
        <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-body">

                {/* Header */}
                <div className="d-flex align-items-center mb-3">

                    <img
                        src={
                            post.user?.profilePicture ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                post.user?.name || "User"
                            )}`
                        }
                        alt="Profile"
                        className="rounded-circle"
                        style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                        }}
                    />

                    <div className="ms-3">
                        <h6 className="mb-0 fw-bold">
                            {post.user?.name}
                        </h6>

                        <small className="text-muted">
                            {new Date(post.createdAt).toLocaleString()}
                        </small>
                    </div>

                </div>

                {/* Text */}
                {editing ? (
                    <textarea
                        className="form-control mb-3"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        rows={3}
                    />
                ) : (
                    <p className="fs-6">{post.text}</p>
                )}

                {/* Image */}
                {post.image && (
                    <img
                        src={post.image}
                        alt="Post"
                        className="img-fluid rounded-4 mb-3"
                    />
                )}

                {/* Buttons */}
                <div className="d-flex align-items-center gap-2 flex-wrap">

                    <button
                        className="btn btn-outline-danger"
                        onClick={handleLike}
                    >
                        ❤️ {isLiked ? "Unlike" : "Like"}
                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleSave}
                    >
                        🔖 Save
                    </button>

                    <span className="fw-semibold">
                        {likes.length} Likes
                    </span>

                    {isOwner && !editing && (
                        <>
                            <button
                                className="btn btn-warning"
                                onClick={() => setEditing(true)}
                            >
                                ✏️ Edit
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                            >
                                🗑 Delete
                            </button>
                        </>
                    )}

                    {editing && (
                        <>
                            <button
                                className="btn btn-success"
                                onClick={handleUpdate}
                            >
                                💾 Save
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setEditing(false);
                                    setEditedText(post.text);
                                }}
                            >
                                ❌ Cancel
                            </button>
                        </>
                    )}

                </div>

                <hr />

                <CommentSection post={post} />

            </div>
        </div>
    );
}

export default PostCard;