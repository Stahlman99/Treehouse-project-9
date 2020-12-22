const express = require('express');
const router = express.Router();
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/auth-user');
const User = require('./models').User;

router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

// Create (POST) user to the database.
router.post('/users', asyncHandler(async (req, res) => {
    try {
        const user = await User.create(req.body);
        console.log(user);
        res.location('/');
        res.status(201).json({ "message": "Account successfully created!" });
      } catch (error) {
        console.log('ERROR: ', error.name);
    
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
}));

module.exports = router;