const chatlModel = require('../models/chat.model');
const userlModel = require('../models/user.model')


async function create(data) {
    return await chatlModel.create(data);
}
async function read(filter, isPopulate) {
    return await userlModel.find(filter).populate(isPopulate ? 'msg':'');
}
async function readOne(filter, isPopulate) {
    return await chatlModel.findOne(filter).populate(isPopulate ? 'msg':'');
}
async function update(id, data) {
    return await chatlModel.findByIdAndUpdate(id, data, { new: true })
}
async function del(id) {
    return await update(id, { isActive: false });
}

module.exports = { create, read, readOne, update, del }