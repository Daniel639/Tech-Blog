const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }],
    });
    res.status(200).json(postData);
  } catch (err) {
    console.error('Error fetching all posts:', err);
    res.status(500).json(err);
  }
});

// GET a single post
router.get('/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['username'] },
        { model: Comment, include: [{ model: User, attributes: ['username'] }] },
      ],
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE a post
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    console.log('New post created:', newPost);
    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// UPDATE a post
router.put('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData[0]) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    
    console.log(`Post ${req.params.id} updated`)
    res.status(200).json(postData);
  } catch (err) {
    console.error(`Error updating post ${req.params.id}:`, err);
    res.status(500).json(err);
  }
});

// DELETE a post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    console.log(`Post ${req.params.id} deleted`);
    res.status(200).json(postData);
  } catch (err) {
    console.error(`Error deleting post ${req.params.id}:`, err);
    res.status(500).json(err);
  }
});

module.exports = router;

