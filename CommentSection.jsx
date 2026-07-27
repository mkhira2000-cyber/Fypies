import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import CommentItem from "./CommentItem";

function CommentSection({ post }) {
    const { user } = useAuth();

    const [comments, setComments] = useState(post.comments || []);
    const [text, setText] = useState("");

    const handleComment = async (e) => {
        e.preventDefault();

        if (!text.trim()) return;

        try {
            const res = await api.post(
                `/posts/${post._id}/comment`,
                {
                    text,
                }
            );

            setComments(res.data.comments);
            setText("");
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(
                `/posts/${post._id}/comment/${commentId}`
            );

            setComments((prevComments) =>
                prevComments.filter(
                    (comment) => comment._id !== commentId
                )
            );
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    return (
        <div style={{ marginTop: "15px" }}>
            <h4>Comments ({comments.length})</h4>

            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                comments.map((comment) => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        currentUser={user}
                        onDelete={handleDeleteComment}
                    />
                ))
            )}

            <form
                onSubmit={handleComment}
                style={{ marginTop: "15px" }}
            >
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{
                        width: "75%",
                        padding: "8px",
                    }}
                />

                <button
                    type="submit"
                    style={{
                        marginLeft: "10px",
                        padding: "8px 15px",
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default CommentSection;