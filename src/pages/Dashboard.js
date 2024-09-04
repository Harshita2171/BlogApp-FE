import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_API_URL } from '../constant';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get(`${BACKEND_API_URL}/api/blogs/mine`, config);
        setBlogs(data);
      } catch (err) {
        setError('Failed to fetch blogs');
        console.error(err);
      }
    };

    if (userInfo && userInfo.token) {
      fetchBlogs();
    } else {
      setError('No user token found');
    }
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog post?");
    if (confirmDelete) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`${BACKEND_API_URL}/api/blogs/${id}`, config);
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (err) {
        setError('Failed to delete blog');
        console.error(err);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">My Blogs</h1>
      <button
        onClick={() => navigate('/create-blog')}
        className="btn btn-primary mb-4"
      >
        Create Blog
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      {blogs.length === 0 ? (
        <p>No blogs found</p>
      ) : (
        <ul className="list-group">
          {blogs.map(blog => (
            <li key={blog._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <Link to={`/blog/${blog._id}`}>
                  <h5>{blog.title}</h5>
                </Link>
                <p className="mb-1 text-muted">{new Date(blog.createdAt).toLocaleDateString()}</p>
                <p>Status: {blog.status}</p>
                {blog.status === 'rejected' && blog.rejectionReason && (
                  <p className="text-danger">
                    <strong>Rejection Reason:</strong> {blog.rejectionReason}
                  </p>
                )}
              </div>
              <div>
                <Link to={`/blog/edit/${blog._id}`} className="btn btn-secondary btn-sm me-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
