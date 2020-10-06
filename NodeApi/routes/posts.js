const express = require('express')
const { createPostValidator } = require('../middleware/createPostValidation')
const { requiredSignin } = require('../controllers/UserAuth')
const router = express.Router()

//get from controllers
const { postById, getPosts, createPost, getPostsByUser, updatePost, deletePost, isPoster } = require('../controllers/posts')
const { userById } = require('../controllers/user')

router.get('/posts', getPosts)
router.post(
    '/post/new/:userId',
    requiredSignin,
    createPost,
    createPostValidator
)
router.get('/posts/By/:userId', requiredSignin, getPostsByUser)
router.put('/post/:postId', requiredSignin, isPoster, updatePost)
router.delete('/post/:postId', requiredSignin, isPoster, deletePost)
router.put('/post/:postId', requiredSignin, isPoster, deletePost)

//any route containing /:userId ,it will execute userById()
router.param('userId', userById)

//any route containing /:postId ,it will execute postById()
router.param('postId', postById)


module.exports = router
