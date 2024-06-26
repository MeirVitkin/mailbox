const userModel = require('../models/user.model')

// CRUD
async function create(data) {
    return await userModel.create(data)
}
async function read(filter) {
    return await userModel.find({ ...filter, isActive: true })
}
async function readOne(filter, populate={} , password = false) { 
    let data;
    if (password){ data = await userModel.findOne({ ...filter, isActive: true }, '+password')}
    else{ data = await userModel.findOne({ ...filter, isActive: true }) } 
    if(populate.chats) data=await data.populate('chats.chat')
    if(populate.users) data=await data.populate('chats.chat.members')    
    return data
}
async function update(id, data) {
    return await userModel.findByIdAndUpdate(id, data, { new: true })
}
async function del(id) {
    return await update(id, { isActive: false })
}
async function save(user) {
    return await user.save()
}
async function readByFlags(id, flags = [], populate = {}) {
    let data = await userModel.findOne({ _id: id, isActive: true })

        if(data){
    data.chats = data.chats.filter(c => flags.every(f => {
        if (typeof f === 'object') {
            let [[k, v]] = Object.entries(f)
            return c[k] == v
        }
        return c[f]
    }))
    if (populate.chats) data = await data.populate('chats.chat')
    if (populate.users) data = await data.populate({ path: 'chats.chat.members', select: "fullName avatar" })
    
    return data.toObject()
    }
    return "no user found"
    
}
module.exports = { create, read, readOne, update, del,save,readByFlags }









// const userModel = require('../models/user.model');

// async function create(data) {
//     return await userModel.create(data);
// }
// async function read(filter) {
//     return await userModel.find({ ...filter, isActive: true });
// }

// async function readOne2(filter,isPopulate) {
//     return await userModel.findOne({...filter, isActive: true}).populate(isPopulate?{ path: 'chats.chat'
       
//         }
//     :"");
// }
// async function readOne(filter, populate={}) {

//     let data = await userModel.findOne({ ...filter, isActive: true })
//      if(populate.chats) data=await data.populate('chats.chat')
//      if(populate.users) data=await data.populate('chats.chat.members')
    
//     return data.toObject()
// }
// async function update(id, data) {
//     return await userModel.findByIdAndUpdate(id, data, { new: true })
// }
// async function del(id) {
//     return await update(id, { isActive: false });
// }

// module.exports = { create, read, readOne, update, del }