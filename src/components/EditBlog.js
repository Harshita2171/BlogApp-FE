import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BACKEND_API_URL } from '../constant';

const EditBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('draft');
    const [bannerImage, setBannerImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type) && file.size <= 5 * 1024 * 1024) {
            console.log(file);
            setBannerImage(file);
            setError('');
        } else {
            setError('Invalid file type or size. Please select a JPG, PNG, WEBP or GIF image under 5MB.');
        }
    };
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get(`${BACKEND_API_URL}/api/blogs/${id}`, config);
                setTitle(data.title);
                setContent(data.content);
                setStatus(data.status);
                setBannerImage(data.image);
                setImageUrl(data.image);
            } catch (error) {
                setError('Error fetching blog details');
            }
        };

        fetchBlog();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (!title || !bannerImage || !content || !status) {
            setLoading(false);
            setError('All fields are required.');
            return;
        }
        const formData = new FormData();
        formData.append('id', id);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('status', status);
        if (bannerImage) {
            formData.append('image', bannerImage);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.put(`${BACKEND_API_URL}/api/blogs/${id}`, formData, config);
            setLoading(false);
            navigate('/dashboard');
        } catch (error) {
            setError('Error updating the blog');
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Edit Blog</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                    <label htmlFor="bannerImage" className="form-label">Banner Image</label>
                    <input
                        type="file"
                        className="form-control"
                        accept=".jpg,.jpeg,.png,.gif,.webp"
                        id="bannerImage"
                        onChange={handleImageUpload}
                    />
                </div>
                {imageUrl && (
                    <div>
                        <img src={`${BACKEND_API_URL}/${imageUrl}`} alt="Banner" style={{ width: '100px', height: 'auto' }} />
                        <p>Current Image</p>
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        required
                    />
                </div>
                <fieldset className="mb-3">
                    <legend>Status</legend>
                    <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            id="draft"
                            name="status"
                            value={status}
                            checked={status === 'draft'}
                            onChange={(e) => setStatus("draft")}
                        />
                        <label htmlFor="draft" className="form-check-label">Save as Draft</label>
                    </div>
                    {/* <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            id="pending"
                            name="status"
                            value={status}
                            checked={status === 'pending'}
                            onChange={(e) => setStatus("pending")}
                        />
                        <label htmlFor="pending" className="form-check-label">Send to Admin</label>
                    </div> */}
                    {userInfo.type !== 1 && (
                        <div className="form-check">
                            <input
                                type="radio"
                                className="form-check-input"
                                id="pending"
                                name="status"
                                value={status}
                                checked={status === 'pending'}
                                onChange={(e) => setStatus("pending")}
                            />
                            <label htmlFor="pending" className="form-check-label"> Send to Admin</label>
                        </div>
                    )}
                    {userInfo.type === 1 && (
                        <div className="form-check">
                            <input
                                type="radio"
                                id="publish"
                                className="form-check-input"
                                name="status"
                                value={status}
                                checked={status === 'published'}
                                onChange={() => setStatus('published')}
                            />
                            <label htmlFor="publish" className="form-check-label">Publish</label>
                        </div>
                    )}
                </fieldset>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Update Blog'}
                </button>
            </form>
        </div>
    );
};

export default EditBlog;
