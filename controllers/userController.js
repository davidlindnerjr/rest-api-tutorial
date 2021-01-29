import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// Description: Register a new user
// Route: POST /api/users
// Access Level: Public

const register = asyncHandler ( async (req, res) => {
    const { fullname, email, username, password } = req.body;

    // We want to see if the user exists
    const userExists = await User.findOne({ username: username });

    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    // If user does not exist
    const user = await User.create({
        fullname,
        email,
        username,
        password
    })

    // Check for the user
    if(user){
        res.status(201).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            pasword: user.password,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        // Throw an error if useris invalid
        res.status(400);
        throw new Error('Invalid User');
    }
})

// Description: Authorize an email or password & we get a token (login)
// Route: POST /api/users/login
// Access Level: Public - anyone can sign in

const authUser = asyncHandler ( async (req, res) =>{

    // What we want to get from the front end
    const { email, password } = req.body;

     // Find the user by email
     const user = await User.findOne({email: email});

     if(user && ( await user.matchPassword(password))){
         return res.json({
             _id: user._id,
             fullname: user.fullname,
             username: user.username,
             email: user.email,
             isAdmin: user.isAdmin,
             token: generateToken(user._id)
         })
     } else {
         res.status(401);
         throw new Error('Invalid email or password');
     }
})

// Description: Get all users
// Route: GET /api/users
// Access Level: Private/Admin - Only certain users and admins can access
const getUsers = asyncHandler ( async (req, res) => {
    const users = await User.find({});
    res.json(users);
})

// Description: Get a user by their ID
// Route: GET /api/users/:id
// Access Level: Admin/ Private - Only certain users and admins can access
const getUserById = asyncHandler ( async (req, res) => {

    //We receive an id in the params of the request
    const user = await User.findById(req.params.id).select('-password');

    if(user){
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
})

// Description: Delete a User
// Route: DELETE /api/users/:id
// Access Level: Private/Admin

const deleteUser = asyncHandler ( async (req, res) =>{
     //We receive an id in the params of the request
     const user = await User.findById(req.params.id);

     if(user){
         await user.remove();
         res.json({ message: 'User removed' });
     } else {
         res.status(404);
         throw new Error('User not found');
     }
})

// Description: Update a user
// Route: PUT /api/users/:id
// Access Level: Private
const updateUser = asyncHandler (async (req, res) => {
    
    const user = await User.findById(req.params.id);

    if(user){
        user.fullname = req.body.fullname || user.fullname;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin || user.isAdmin;
        user.username = req.body.username ||  user.username;
        user.password = req.body.password || user.password;

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            fullname: updatedUser.fullname,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            username: updatedUser.username,
            passsword: updatedUser.password
        })
    } else {
        res.status(404);
        throw new Error('User not found');
    }
})

export { register, authUser, getUsers, getUserById, deleteUser, updateUser };