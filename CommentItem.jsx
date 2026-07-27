function CommentItem({ comment, currentUser, onDelete }) {
    const isOwner =
        comment.user?._id === currentUser?._id;

    return (
        <div
            style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                marginBottom: "10px",
            }}
        >
            <strong>{comment.user?.name}</strong>

            <p
                style={{
                    margin: "5px 0",
                }}
            >
                {comment.text}
            </p>

            {isOwner && (
                <button
                    type="button"
                    onClick={() => onDelete(comment._id)}
                    style={{
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    🗑 Delete
                </button>
            )}
        </div>
    );
}

export default CommentItem;