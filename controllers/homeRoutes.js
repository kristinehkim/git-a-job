const router = require("express").Router();
const { User, Post, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get('/', withAuth, async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['id','name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((project) => project.get({ plain: true }));
    console.log(posts);
    posts.forEach(post => {
      // check if post user ID matches the user's ID,
      post.isUsersPost = req.session.user_id === post.user_id
      // if yes set post.isuserspost
    
    });
    // Pass serialized data and session flag into template
    res.render('all-posts', { 
      layout: 'main',
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ['name']
          }
        }
      ],
    });

    const post = postData.get({ plain: true });

    res.render('select-post', {
      // layout: 'main',
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
// router.get('/', withAuth, async (req, res) => {
//   try {
//     // Find the logged in user based on the session ID
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ["password"] },
//       include: [{ model: Post }],
//     });
//     const user = userData.get({ plain: true });

//     res.render('all-posts', {
//       // layout: 'main',
//       ...user,
//       logged_in: true,
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
    }
    res.render('login');
});

router.get('/new-post', (req, res) => {
  // If the user is already logged in, redirect the request to another route
    res.render('create-post', {
      layout: 'main'
    });
});

router.get('/make-comment', (req, res) => {
  // If the user is already logged in, redirect the request to another route
    res.render('make-comment', {
      layout: 'main'
    });
});

module.exports = router;
