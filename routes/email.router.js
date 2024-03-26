const express = require('express'),
    router = express.Router();
const emailService = require('../BL/email.service')
const messageService = require('../BL/message.service');
const { auth } = require('../middelweres/auth');

router.post('/', auth, async (req, res) => {
    try{
        const { subject, content, to, user } = req.body;
        res.send({
                id: user.id,
                subject,
                content,
                to,
                from: user.email
            })
    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")
    }
    
})

router.get('/', async (req, res) => {
    try{
        const result = await emailService.getAllrecieved()
        res.send(result)

    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")

    }
})

router.get('/inbox',auth, async (req, res) => {
    try{
        const userId = req.body.user.id;

        const result = await emailService.getfilteredEmails(userId,{isRecieved:true})
        res.send(result)

    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")

    }
})

router.get('/outgoing',auth, async (req, res) => {
    try{
        const userId = req.body.user.id;

        const result = await emailService.getfilteredEmails(userId,{isSent:true})
        res.send(result)

    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")

    }
})

router.get('/deleted',auth, async (req, res) => {
    try{
        const userId = req.body.user.id;

        const result = await emailService.getfilteredEmails(userId,{isDeleted:true})
        res.send(result)

    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")

    }
})

router.post('/:emailId', async (req, res) => {
    try{
        const result = await emailService.addNewMessageToEmail(req.params.emailId, req.body);
        res.send(result);

    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")

    }
})

router.put('/:messageId',auth,async (req, res) => {
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