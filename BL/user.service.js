const userController = require('../DL/controllers/user.controller');


async function getUser(filter) {
    return await userController.readOne(filter,false);
}

async function getUserEmails(filter) {
    return await userController.readOne(filter,true);
}




module.exports = {getUser, getUserEmails};