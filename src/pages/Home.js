import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BACKEND_API_URL } from '../constant';

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await axios.get(`${BACKEND_API_URL}/api/blogs`);
      setBlogs(data);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Blogs</h1>
      <div className="row">
        {blogs.map((blog) => (
          <div key={blog._id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={`${BACKEND_API_URL}/${blog.image}`}
                className="card-img-top"
                alt={blog.title}
              />
              <div className="card-body">
                <h5 className="card-title">
                  <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                </h5>
                <p className="card-text text-muted">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <Link to={`/blog/${blog._id}`} className="btn btn-primary btn-sm">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
