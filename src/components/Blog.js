import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Blog = () => {
  const [blog, setBlog] = useState({});
  const { id } = useParams();
  console.log(id, "hukh");


  useEffect(() => {
    const fetchBlog = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      console.log(data, "data");
      setBlog(data);
    };
    fetchBlog();
  }, [id]);

  return (
    <div className='container m-5'>
      <h1 className='text-center'>{blog.title}</h1>
      <img className='mb-5' style={{width:'auto',maxHeight:'400px'}} src={`http://localhost:5000/${blog.image}`} alt="blog" />
      <p dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
};

export default Blog;
