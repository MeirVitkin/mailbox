const userController = require('../DL/controllers/user.controller');
const { createToken } = require('../utils/jwt');
const  bcrypt = require('bcrypt');
const saltRounds = 10;

async function getUser(filter) {
    return await userController.readOne(filter, { chats: true, users: true });
}

async function getUserEmails(filter) {
    return await userController.readOne(filter, true);
}

async function login(data) {
    const user = await userController.readOne({ email: data.email },  { chats: false, users: false },true);
    if (!user) throw { msg: 'User not found' }
    console.log(user);
    const correctPassword = bcrypt.compareSync(data.password, user.password)
    if (!correctPassword) throw { msg: 'password mismatch' }
    const token = createToken(user);
    user.password = null
    return { token: token, user: user }
}

async function register(data) {
    const user = await userController.readOne({ email: data.email });
    if (user) throw { msg: 'email already registered' }
    const hash = bcrypt.hashSync(data.password, saltRounds)
     await userController.create({ ...data, password: hash, fullName: `${data.firstName} ${data.lastName}` })
    return true;


}




module.exports = { getUser, getUserEmails, login, register };