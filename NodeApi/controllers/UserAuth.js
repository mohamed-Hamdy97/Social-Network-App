var jwt = require('jsonwebtoken');
const User = require('../models/users')
const expressJwt = require('express-jwt')
//signUp
exports.signUp = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email })
    console.log('here');
    if (userExists) {
        return res.status(403).json({
            error: 'Email is exist'
        })
    }
    const user = await new User(req.body);
    await user.save()
    res.json({ authProcess: 'signUp is successful' })
}

//signIn
exports.signin = (req, res) => {
    const { email, password } = req.body
    //find user based on email
    const user = User.findOne({ email }, (err, user) => {
        //if err or no user
        if (err || !user) {
            return res.status(401).json({
                err: 'this user is not exist.please signUp first!'
            })
        }
        //if user authenticated
        if (!user.authenticateUser(password)) {
            return res.status(401).json({
                err: 'this email  or password is not correct ,please write again '
            })
        }

        //generate token based on user_id and secret
        const token = jwt.sign({ _id: user.id }, process.env.SECRET_TOKEN);

        //presist the token as 't' in cookies with expire date
        res.cookie('t', token, { expire: new Date() + 9999 })

        //rteturn response with finding user and token to client
        const { _id, email, name } = user
        return res.json({ token, user: { _id, email, name } })

    })
}

//signOut
exports.signOut = (req, res) => {
    res.clearCookie('t')
    return res.status(200).json({ message: "signOut success" })
}

exports.requiredSignin = expressJwt({
    //if the token is valid ,expressJwt appends the verified users id in 
    //an auth key to req object
    secret: process.env.SECRET_TOKEN,
    userProperty: 'auth'
})