import { useState } from "react";
import useCsrfToken from "../hooks/useCsrfToken";
import useAuth from "../hooks/useAuth";

function NewComment({ postId, setCommentSuccess, commentSuccess }) {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        content: "",
        author: user ? user.id : null,
    });
    const csrfToken = useCsrfToken();
    const isProduction = process.env.NODE_ENV === "production";
    const baseUrl = isProduction
        ? ""
        : process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
    const resetForm = () => {
        setFormData({
            content: "",
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const apiUrl = `${baseUrl}/content/posts/${postId}/comments/`;

        const fetchConfig = {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken.csrfToken,
            },
            credentials: "include",
        };

        const response = await fetch(apiUrl, fetchConfig);

        if (response.ok) {
            event.target.reset();
            setFormData({
                content: "",
                author: user ? user.id : null,
            });
            setCommentSuccess(!commentSuccess);
        }
    };

    const handleChangeInput = (e) => {
        const value = e.target.value;
        const inputName = e.target.name;
        setFormData({
            ...formData,
            [inputName]: value,
        });
    };

    return (
        <div className="card w-100 my-3 border-0">
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label">Content</label>
                        <textarea
                            name="content"
                            className="form-control"
                            value={formData.content}
                            onChange={handleChangeInput}
                            placeholder="Write your comment here"
                            rows="3"
                            required
                        ></textarea>
                    </div>
                    <div className="text-end">
                        <button
                            className="btn btn-outline-primary me-2"
                            type="button"
                            onClick={resetForm}
                        >
                            Reset
                        </button>
                        <button
                            className="btn btn-primary"
                            data-bs-dismiss="modal"
                            type="submit"
                        >
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewComment;
