const express = require('express');
const { signin, signup, changePassword } = require('../controller/AdminController');
const { getUsers, getUserByID, addUser, updateUsers, deleteUsers } = require('../controller/UserController');
const { verifyToken } = require('../validation/tokenValidation');
const router = express.Router();

//admin routes
router.post('/admin/signin', signin);
router.post('/admin/signup', signup);
router.post('/admin/change_pass', changePassword);

//user routes
router.get('/getUsers', verifyToken, getUsers)
router.post('/addUser', verifyToken, addUser)
router.delete('/deleteUser/:id', verifyToken, deleteUsers)
router.put('/updateUser/:id', verifyToken, updateUsers)
router.get('/getUserByID/:id', verifyToken, getUserByID)

module.exports = { router };