const express = require('express'),
    router = express.Router();
const messageService = require('../BL/message.service');
const { auth } = require('../middelweres/auth');


router.post('/:messageId',auth,async (req, res) => {
    try{
        const userEmail = req.body.user.email;
        const messageId = req.params.messageId;
        const isRead = req.body.isRead;

        const result = await messageService.updateIsReadMessage(userEmail,messageId,isRead);
        res.send(result);
    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")

    }

})

module.exports = router;
