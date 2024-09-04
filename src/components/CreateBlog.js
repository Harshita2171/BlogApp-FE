import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BACKEND_API_URL } from '../constant';

const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('draft');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && ['image/jpeg', 'image/png', 'image/gif','image/webp'].includes(file.type) && file.size <= 5 * 1024 * 1024) {
            console.log(file);
            setImage(file);
        } else {
            setError('Invalid file type or size. Please select a JPG, PNG, WEBP or GIF image under 5MB.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !image || !content || !status) {
            setError('All fields are required.');
            return;
        }

        if (!userInfo) {
            setError('You must be logged in to create a blog.');
            return;
        }

        const formData = new FormData();
        console.log(image, "hjygjg");

        formData.append('title', title);
        formData.append('image', image);
        formData.append('content', content);
        formData.append('status', status);
        formData.append('author', userInfo._id);
        console.log(formData, "form");
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };
            console.log(formData, "form35");
            for (let [key, value] of formData.entries()) {
                console.log(key, value, "data"); // This should log each key/value pair in the formData
            }

            await axios.post(`${BACKEND_API_URL}/api/blogs`, formData, config);
            navigate('/dashboard'); // Redirect to dashboard after successful blog creation
        } catch (err) {
            setError('Failed to create blog. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Create a New Blog</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Banner Image</label>
                    <input
                        type="file"
                        className="form-control"
                        id="image"
                        accept=".jpg,.jpeg,.png,.gif,.webp"
                        onChange={handleImageUpload}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <div>
                        <input
                            type="radio"
                            id="draft"
                            name="status"
                            value="draft"
                            checked={status === 'draft'}
                            onChange={() => setStatus('draft')}
                        />
                        <label htmlFor="draft" className="form-check-label">Save as Draft</label>
                    </div>
                    {userInfo.type !== 1 && (
                        <div>
                            <input
                                type="radio"
                                id="pending"
                                name="status"
                                value="pending"
                                checked={status === 'pending'}
                                onChange={() => setStatus('pending')}
                            />
                            <label htmlFor="pending" className="form-check-label">Send to Admin</label>
                        </div>
                    )}
                    {userInfo.type === 1 && (
                        <div>
                            <input
                                type="radio"
                                id="publish"
                                name="status"
                                value="publish"
                                checked={status === 'published'}
                                onChange={() => setStatus('published')}
                            />
                            <label htmlFor="publish" className="form-check-label">Publish</label>
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">Create Blog</button>
            </form>
        </div>
    );
};

export default CreateBlog;
