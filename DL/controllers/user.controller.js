const userModel = require('../models/user.model');

async function create(data) {
    return await userModel.create(data);
}
async function read(filter) {
    return await userModel.find({ ...filter, isActive: true });
}

async function readOne(filter,isPopulate) {
    return await userModel.findOne({...filter, isActive: true}).populate(isPopulate?{
        path: 'emails.email',
            populate: {
                path: 'msg'
            }
        }
    :"");
}
async function update(id, data) {
    return await userModel.findByIdAndUpdate(id, data, { new: true })
}
async function del(id) {
    return await update(id, { isActive: false });
}

module.exports = { create, read, readOne, update, del }