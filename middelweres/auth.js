const jwt = require('jsonwebtoken');
const userService = require('../BL/user.service');

const secret = process.env.JWT_SECRET;
async function auth(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) throw 'no token provided'
        const correct = jwt.verify(token, secret)
        if (!correct) throw 'Invalid authorization'
        const user = await userService.getUser({ _id: correct._id });
        if (!user) throw 'no user found'
        req.body.user = { _id: user._id, email: user.email, fullName: user.fullName };
        next();
    } catch (e) {
        console.log(e);
        res.sendStatus(401);
    }

}

module.exports = { auth }