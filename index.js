import express from 'express';
import { JSONFilePreset } from 'lowdb/node';

async function startServer() {
  const app = express();
  const db = await JSONFilePreset('data.json', { posts: [] });

  // Middleware to parse JSON bodies
  app.use(express.json());

  // GET all posts
  app.get('/api/posts', (req, res) => {
    const posts = db.data.posts;
    res.json(posts);
  });

  // GET a single post by ID
  app.get('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = db.data.posts.find(post => post.id === postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  });

  // POST a new post
  app.post('/api/posts', (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newPost = { id, name };
    db.data.posts.push(newPost);
    db.write();
    res.status(201).json(newPost);
  });

  // PUT update an existing post by ID
  app.put('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { name } = req.body;
    const postIndex = db.data.posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }
    db.data.posts[postIndex].name = name;
    db.write();
    res.json(db.data.posts[postIndex]);
  });

  // DELETE a post by ID
  app.delete('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = db.data.posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }
    const deletedPost = db.data.posts.splice(postIndex, 1)[0];
    db.write();
    res.json(deletedPost);
  });

  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}

startServer().catch(err => {
  console.error("Error starting server:", err);
});
