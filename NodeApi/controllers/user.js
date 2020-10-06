const User = require('../models/users')
const _ = require('lodash');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'not fouded user'
            })
        }

        req.profile = user //add the user object in the new profile properity in the req
        next()

    })

}

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id
    if (!authorized) {
        return res.status(403).json({
            message: 'user is not authorized to do this action'
        })
    }
}

exports.getAllUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({ users })
    }).select('_id name email created updated')
}

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json({ user: req.profile })
}

exports.updateUser = (req, res) => {
    let user = req.profile
    user = _.extend(user, req.body)
    user.updated = Date.now()
    user.save((err) => {
        if (err) {
            return res.status(400).json({
                error: 'you ara not authorized to perform this action'
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined
        res.json({ user })
    })
}

exports.deleteUser = (req, res) => {
    let user = req.profile
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'you ara not authorized to perform this action'
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined
        res.json({ message: "user deleted successfully" })
    })
}