const chatController = require('../DL/controllers/chat.controller');
const userService = require('./user.service');
const userController = require('../DL/controllers/user.controller')
const { Flags } = require('../utility')

let funcs = {
    inbox: [Flags.Inbox],
    notread: [Flags.NotRead],
    send: [Flags.Sent],
    favorite: [Flags.Favorite],
    deleted: [Flags.Deleted],
    draft: [Flags.Draft],
}

async function getNotifications(userId) {
    const user = await userService.getUser({ _id: userId });
    let notifications = {
        send: 0,
        inbox: 0
    }
    if (user) {
        user.chats.map(c => {
            if (c.isRead === false && c.isSent ) {
                 notifications.send = notifications.send + 1;
            }
            if (c.isRead === false && c.isRecieved) {
                notifications.inbox = notifications.inbox + 1;
            }
        })
    }
    return notifications;
}

async function getChats(userId, flag) {
    if (!funcs[flag]) throw ""
    let { chats } = await userController.readByFlags(userId, funcs[flag], { chats: true, users: true });
    return chats
}
async function updateReadChat(userId, chatId) {
    let user = await userController.readOne(userId);
    user.chats.find(c => c._id == chatId).isRead = true
    userController.save(user)
}
async function getfilteredChats(userId, filter) {
    let filteredChats;
    const user = await userService.getUser({ _id: userId });
    switch (filter) {
        case "isRead":
            filteredChats = user.chats.filter(email => email.isRead == true)
            break;

        case "isFavorite":
            filteredChats = user.chats.filter(email => email.isFavorite == true)
            break;

        case "isDeleted":
            filteredChats = user.chats.filter(email => email.isDeleted == true)
            break;

        case "isRecieved":
            filteredChats = user.chats.filter(email => email.isRecieved == true)
            console.log(filteredChats);
            break;

        case "isSent":
            filteredChats = user.chats.filter(email => email.isSent == true)
            break;

        default:
            console.log("Unknown email");
            break;
    }
    let ids = [];
    filteredChats.map(email => (ids.push(email.email)));
    const populateMsg = await chatController.readOne({ _id: { $in: ids } }, true);

    return populateMsg || "nothing found";
}
async function updateEmailState(userEmail, emailId, state) {

    const user = await userService.getUser({ email: userEmail });
    if (user) {
        const messageIndex = user.chats.findIndex(emailObj => emailObj.email.equals(emailId));
        if (messageIndex !== -1) {
            let bool;
            switch (state) {
                case "isRead":
                    bool = user.chats[messageIndex].isRead;
                    user.chats[messageIndex].isRead = !bool;
                    break;
                case "isFavorite":
                    bool = user.chats[messageIndex].isFavorite;
                    user.chats[messageIndex].isFavorite = !bool;
                    break;
                case "isDeleted":
                    bool = user.chats[messageIndex].isDeleted;
                    user.chats[messageIndex].isDeleted = !bool;
                    break;
                case "isRecieved":
                    bool = user.chats[messageIndex].isRecieved;
                    user.chats[messageIndex].isRecieved = !bool;
                    break;
                case "isSent":
                    bool = user.chats[messageIndex].isSent;
                    user.chats[messageIndex].isSent = !bool;
                    break;

                default:
                    console.log("Unknown email");
                    break;
            }

        }
        return await user.save();
    }
    return "user not found";
}
async function addNewMessageToEmail(emailId, msg) {
    let msgDB = await messageController.create(msg)
    let email = await chatController.readOne({ _id: emailId })
    email.msg.push(msgDB._id)
    return await email.save()

}
async function sendEmail(to, msg) {
    const filteredEmails = filterExistEmails(to);
    let msgDB = await messageController.create(msg)
    //TODO


}
async function deleteEmail(userId, emailsMessages) {
}
async function filterExistEmails(emails) {
    const existingEmails = await Promise.all(emails.map(async (email) => {
        const user = await userService.getUser({ email });
        if (user !== null) {
            return email;
        }
    }));

    return existingEmails.filter(email => email);
}

module.exports = {
    getfilteredChats,
    addNewMessageToEmail,
    filterExistEmails,
    sendEmail,
    updateEmailState,
    getChats,
    updateReadChat,
    getNotifications
};