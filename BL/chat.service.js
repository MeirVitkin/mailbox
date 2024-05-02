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
            if (c.isRead === false && c.isSent) {
                notifications.send = notifications.send + 1;
            }
            if (c.isRead === false && !c.isSent) {
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
async function getChatsBySearch(userId, value) {
    const user = await userService.getUser({ _id: userId }, { chats: true, users: true });
    if (user) {
        console.log(user.chats);
        const filteredChats = user.chats.filter(c => c.chat.subject.toLowerCase().includes(value.toLowerCase()))
        return filteredChats;

    }

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
async function startChat(from, to, msg) {
    try {
        const filteredMembers = await filterExistEmails(to);
        let msgData = {
            subject: msg.subject,
            msg: [{
                from: from,
                content: msg.content,
            }],
            members: filteredMembers,
        }
        const result = await chatController.create(msgData);
        console.log(result._id);
        if (!result) throw new Error("Could not create message");
        // 661c41f140f0d8beab7cf7fb
        const updateUserPromises = filteredMembers.map(async (member) => {
            let user = await userController.readOne({ _id: member });
 
            if (!user || from?.toString() === user?._id?.toString()) return;

            let msg = {
                chat: result._id,
                isSent: false,
                isRecieved: true
            };
            user.chats.push(msg);

            return user.save();
        });

        await Promise.all(updateUserPromises);

        let sender = await userController.readOne({ _id: from });
        if (sender) {
            let msg = {
                chat: result._id,
                isSent: true,
                isReceived: false
            };
            sender.chats.push(msg);
            await sender.save();
        }

        console.log("Chat creation and user updates completed successfully");
    } catch (error) {
        console.error("Error in starting chat:", error);
        throw error;
    }
}

async function deleteEmail(userId, emailsMessages) {
}
async function filterExistEmails(emails) {
    const existingMembers = await Promise.all(emails.map(async (email) => {
        const user = await userService.getUser({ email });
        if (user) {
            return user._id;
        }
    }));

    return existingMembers.filter(member => member);
}
async function go() {
    const msg = { subject: "Starting a new job", content: "Hi there and now that you have a new job you can start a new job and start a new job with the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and the following parameters and following" };
    await startChat('6614e0b92018f4d5b33dd95d', ['meir@gmail.com', 'user2@example.com', 'user3@example.com'], msg);
}
//   go()

module.exports = {
    getfilteredChats,
    addNewMessageToEmail,
    filterExistEmails,
    sendEmail: startChat,
    updateEmailState,
    getChats,
    updateReadChat,
    getNotifications,
    getChatsBySearch,
    startChat
};