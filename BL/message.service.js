const messageController = require('../DL/controllers/message.controller');
const userController = require('../DL/controllers/user.controller');

async function updateIsReadMessage(userEmail,messageId,isRead){

    const user = await userController.readOne({email: userEmail});
        if(user){
            let messageIndex =-1;
            for (let i = 0; i < user.emails.length; i++) {
                if(user.emails[i].email.equals(messageId)){
                    messageIndex = i;
                    break;
                }
                
            }
            
            if(messageIndex !== -1) {
                user.emails[messageIndex].isRead=isRead;
            }

            return await user.save();
            }
            return "user not found";
}

module.exports = {updateIsReadMessage}