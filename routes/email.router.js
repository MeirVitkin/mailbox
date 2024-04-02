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

router.get('/',auth, async (req, res) => {
    try{
        const userId = req.body.user.id;
        const result = await emailService.getfilteredEmails(userId,{})
        res.send(result)

    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")

    }
})

router.get('/inbox',auth, async (req, res) => {
    try{
        const userId = req.body.user.id;

        const result = await emailService.getfilteredEmails(userId,"isRecieved")
        res.send(result)

    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")

    }
})

router.get('/outgoing',auth, async (req, res) => {
    try{
        const userId = req.body.user.id;

        const result = await emailService.getfilteredEmails(userId,"isSent")
        res.send(result)

    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")

    }
})

router.get('/deleted',auth, async (req, res) => {
    try{
        const userId = req.body.user.id;

        const result = await emailService.getfilteredEmails(userId,"isDeleted")
        res.send(result)

    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")

    }
})

router.get('/favorite',auth, async (req, res) => {
    try{
        const userId = req.body.user.id;

        const result = await emailService.getfilteredEmails(userId,"isFavorite")
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

router.put('/:emailId',auth,async (req, res) => {
    try{
        const userEmail = req.body.user.email;
        const emailId = req.params.emailId;
        const state = req.body.state;
        const result = await emailService.updateEmailState(userEmail,emailId,state);
        res.send(result);
    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")

    }

})





module.exports = router;