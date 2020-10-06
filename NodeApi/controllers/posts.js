const Post = require('../models/posts')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash');

exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate('postedBy', '_id name')
        .exec((err, post) => {
            if (err) {
                return res.status(400).json({
                    message: "err no post with this id" + err
                })
            }
            req.post = post
            next()

        })
}

exports.isPoster = (req, res, next) => {
    const autherized = req.post && req.auth && req.post.postedBy._id == req.auth._id; //== not ===

    if (!autherized) {
        return res.status(400).json({
            message: "user aren't authoreized to make this action"
        })
    }
    next()
}

exports.getPosts = (req, res) => {
    const posts = Post.find()
        .populate('postedBy', '_id name')
        // .select('name title body')
        .then((posts) => {
            res.json({ posts })
        })
        .catch((err) => console.log(err))
}
exports.createPost = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        let post = new Post(fields);

        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });

}


exports.getPostsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .sort("created")
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    message: "error when getting posts by user" + err
                })
            }
            res.json({ posts })
        })
}

exports.deletePost = (req, res) => {
    let post = req.post
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                message: 'you ara not authorized to perform this action'
            })
        }
        res.json({
            message: "Post deleted  successfully"
        })
    })
}

exports.updatePost = (req, res) => {
    let post = req.post
    post = _.extend(post, req.body)
    post.updated = Date.now()
    post.save((err) => {
        if (err) {
            return res.status(400).json({
                message: 'error updating' + err
            })
        }
        res.json({ post })
    })
}