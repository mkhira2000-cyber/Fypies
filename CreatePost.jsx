import { useState } from "react";
import api from "../api";

function CreatePost({ onPostCreated }) {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!text.trim() && !image) return;

        try {
            const formData = new FormData();

            formData.append("text", text);

            if (image) {
                formData.append("image", image);
            }

            const res = await api.post("/posts", formData);

            setText("");
            setImage(null);

            document.getElementById("postImage").value = "";

            onPostCreated(res.data.post);
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">

                <h4 className="fw-bold mb-3">
                    Create New Post
                </h4>

                <form onSubmit={handleSubmit}>

                    <textarea
                        className="form-control mb-3"
                        placeholder="What's on your mind?"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        style={{
                            resize: "none",
                            borderRadius: "12px",
                        }}
                    />

                    <input
                        id="postImage"
                        type="file"
                        className="form-control mb-3"
                        onChange={(e) => setImage(e.target.files[0])}
                    />

                    <div className="d-grid">

                        <button
                            type="submit"
                            className="btn text-white fw-bold"
                            style={{
                                backgroundColor: "#800020",
                                borderRadius: "10px",
                                padding: "10px",
                            }}
                        >
                            📤 Post
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default CreatePost;