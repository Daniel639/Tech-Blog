const router = require('express').Router();
const { User } = require('../../models');

// CREATE new user
router.post('/', async (req, res) => {
  try {
    console.log('Attempting to create new user:', req.body.username);
    const userData = await User.create(req.body);
    console.log('User created successfully:', userData.id);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      console.log('Session saved for user:', userData.id);
      res.status(200).json({ id: userData.id, username: userData.username });
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(400).json(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt for username:', req.body.username);
    const userData = await User.findOne({ where: { username: req.body.username } });

    if (!userData) {
      console.log('User not found in database');
      res.status(400).json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    console.log('User found, checking password');
    const validPassword = await userData.checkPassword(req.body.password);
    console.log('Password check result:', validPassword);

    if (!validPassword) {
      console.log('Invalid password');
      res.status(400).json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    console.log('Password valid, creating session');
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      console.log('Login successful for user:', userData.id);
      res.json({ 
        user: { id: userData.id, username: userData.username }, 
        message: 'You are now logged in!' 
      });
    });

  } catch (err) {
    console.error('Error in login route:', err);
    res.status(500).json(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      console.log('User logged out');
      res.status(204).end();
    });
  } else {
    console.log('Logout attempted but no user was logged in');
    res.status(404).end();
  }
});

module.exports = router;