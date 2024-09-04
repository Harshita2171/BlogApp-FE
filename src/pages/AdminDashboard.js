import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [rejectingBlogId, setRejectingBlogId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchBlogs = async () => {
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };
    const { data } = await axios.get('http://localhost:5000/api/blogs/pending', config);
    setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const approveBlog = async (id) => {
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };
    await axios.put(`http://localhost:5000/api/blogs/approve/${id}`, {}, config);
    fetchBlogs();
  };

  const rejectBlog = async (id) => {
    setRejectingBlogId(id); // Set the ID of the blog being rejected
  };

  const submitRejectionReason = async (id) => {
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };
    await axios.put(`http://localhost:5000/api/blogs/reject/${id}`, { rejectionReason }, config);
    setRejectingBlogId(null); // Reset rejecting blog ID after submission
    setRejectionReason(''); // Clear the reason input
    fetchBlogs();
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">All Blogs</h1>
      {blogs.length === 0 ? (
        <p>No pending blogs.</p>
      ) : (
        <ul className="list-group">
          {blogs.map((blog) => (
            <li key={blog._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Link to={`/blog/${blog._id}`}>
                    <h5 className="mb-1">{blog.title}</h5>
                  </Link>
                  <small className="text-muted">
                    {new Date(blog.createdAt).toLocaleDateString()} by {blog.author.name}
                  </small>
                  <p className="mb-1"><strong>Status:</strong> {blog.status}</p>
                </div>
                <div>
                  {blog.status !== 'published' && (
                    <button onClick={() => approveBlog(blog._id)} className="btn btn-success btn-sm me-2">
                      Publish
                    </button>
                  )}
                  {blog.status !== 'rejected' && (
                    <button onClick={() => rejectBlog(blog._id)} className="btn btn-danger btn-sm">
                      Reject
                    </button>
                  )}
                </div>
              </div>
              {rejectingBlogId === blog._id && (
                <div className="mt-3">
                  <textarea
                    className="form-control"
                    placeholder="Enter reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <button
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => submitRejectionReason(blog._id)}
                  >
                    Submit Rejection
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
