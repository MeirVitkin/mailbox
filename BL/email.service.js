const emailController = require('../DL/controllers/email.controller');
const messageController = require('../DL/controllers/message.controller');
const userService = require('./user.service');


async function getfilteredEmails(userId, filter) {
    const user = await userService.getUserEmails({ _id: userId, emails: { $elemMatch: filter } });
    return user?.emails || "nothing found";
}
async function updateEmailState(userEmail, emailId, state) {

    const user = await userService.getUser({ email: userEmail });
    if (user) {
        const messageIndex = user.emails.findIndex(emailObj => emailObj.email.equals(emailId));
        if (messageIndex !== -1) {
            let bool;
            switch (state) {
                case "isRead":
                bool = user.emails[messageIndex].isRead;
                user.emails[messageIndex].isRead = !bool;
                    break;
                case "isFavorite":
                bool = user.emails[messageIndex].isFavorite;
                user.emails[messageIndex].isFavorite = !bool;
                    break;
                case "isDeleted":
                bool = user.emails[messageIndex].isDeleted;
                user.emails[messageIndex].isDeleted = !bool;
                    break;
                case "isRecieved":
                bool = user.emails[messageIndex].isRecieved;
                user.emails[messageIndex].isRecieved = !bool;
                    break;
                case "isSent":
                bool = user.emails[messageIndex].isSent;
                user.emails[messageIndex].isSent = !bool;
                    break;
            
                default:
                    console.log("Unknown email");
                    break;
            }
            // if (state) {
            //     bool = user.emails[messageIndex].isRead;
            //     user.emails[messageIndex].isRead = !bool;
            // } else {
            //     bool = user.emails[messageIndex].isFavorite;
            //     user.emails[messageIndex].isFavorite = !bool;
            // }
        }
        return await user.save();
    }
    return "user not found";
}
async function addNewMessageToEmail(emailId, msg) {
    let msgDB = await messageController.create(msg)
    let email = await emailController.readOne({ _id: emailId })
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
    getfilteredEmails,
    addNewMessageToEmail,
    filterExistEmails,
    sendEmail,
    updateEmailState
};