import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js';

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // password is encrypted in a user.pre('save') method
  const user = await User.create({
    name, email, password
  })
  
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
});

// @desc    Auth user and get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get logged in user profile. Protect middleware gets token from the header, uses the user id from it to find the user and assigns the user to req.user to be used in protected routes. 
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => { 
  // get the user with req.user assigned by protect middleware
  const user = await User.findById(req.user._id)

  if (user) {
    // return user object without the token. Just returning data: user would include the token
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { authUser, getUserProfile, registerUser };
