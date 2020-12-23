'use strict';

// Import modules.
const express = require('express');
const router = express.Router();
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/auth-user');
const User = require('./models').User;
const Course = require('./models').Course;

/*
  User Routes
*/

// A GET route that retrieves the current user.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

// A POST route that creates (POSTs) a user to the database.
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.location('/');
        res.sendStatus(201);
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

/*
  Course Routes
*/

// A GET route that retrieves the list of courses.
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    attributes: {exclude: ['createdAt', 'updatedAt', 'userId']},
    include: [{
      model: User,
      attributes: {exclude: ['createdAt', 'updatedAt', 'password']}
    }]
  });

  res.json({
      courses
  });
}));

// A GET route that retrieves a specific course.
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: {exclude: ['createdAt', 'updatedAt', 'userId']},
    include: [{
      model: User,
      attributes: {exclude: ['createdAt', 'updatedAt', 'password']}
    }]
  });

  res.json({
      course
  });
}));

// A POST route that creates (POSTs) a course to the database.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try {
      const course = await Course.create(req.body);
      res.location(`/courses/${course.id}`);
      res.sendStatus(201);
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

// A PUT route that allows the users to update a specific course.
router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {

  let course;
  try {
    course = await Course.findByPk(req.params.id);
    if(course) {
      if (req.currentUser.id == course.userId) {
        await course.update(req.body);
        res.sendStatus(204);
      } else {
        res.status(403).json({ Forbidden: "Unauthorized User" });
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// A DELETE route that deletes a specific course.
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);
  if(course) {
    if (req.currentUser.id == course.userId) {
      await course.destroy();
      res.sendStatus(204);
    } else {
      res.status(403).json({ Forbidden: "Unauthorized User" });
    }
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;