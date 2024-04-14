const jwt = require('jsonwebtoken');


const createToken = (user) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
}

const checkToken = (token) => {
    const payload = jwt.verify( token , process.env.JWT_SECRET)
    return payload;
}

module.exports = { createToken ,checkToken };