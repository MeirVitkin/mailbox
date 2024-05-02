const express = require('express'),
    router = express.Router();
const chatService = require('../BL/chat.service');
const { auth } = require('../middelweres/auth');

router.post('/', async (req, res) => {
    try {
        const { subject, content, to, user } = req.body;
        res.send({
            id: user.id,
            subject,
            content,
            to,
            from: user.email
        })
    } catch (err) {
        res.status(405).send(err.msg || err.message || "wrong")
    }

})

router.post('/newMessage', async (req, res) => {
    try {
        const message = { content: req.body.msg, subject: req.body.subject}
        const user = req.body.user._id
        const to = [...req.body.to , req.body.user.email]
        const result = await chatService.startChat(user,to,message);
        res.send(result);

    } catch (err) {
        res.status(405).send(err.msg || err.message || "wrong")

    }
})

router.get('/search/:leters', async (req, res) => {
    try {
        const userId = req.body.user._id;
        const letersToSearch = req.params.leters
        const result = await chatService.getChatsBySearch(userId, letersToSearch)
        res.send(result)

    } catch (err) {
        res.status(405).send(err.msg || err.message || "wrong")

    }
})
// router.get('/:emailId',auth, async (req, res) => {
//     try{
//         const userId = req.body.user._id;
//         const result = await chatService.getChats(userId,{_id:req.params.emailId})
//         res.send(result)

//     }catch(err){
//         res.status(405).send(err.msg || err.message || "wrong")

//     }
// })
router.get('/notifications', async (req, res) => {
    try {
        const userId = req.body.user._id;
        const result = await chatService.getNotifications(userId)
        res.send(result)

    } catch (err) {
        res.status(405).send(err.msg || err.message || "wrong")

    }
})

router.get('/:flag', async (req, res) => {
    try {
        let result = await chatService.getChats(req.body.user._id, req.params.flag)
        res.send(result)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})


// router.get('/inbox',auth, async (req, res) => {
//     try{
//         const userId = req.body.user.id;

//         const result = await emailService.getfilteredEmails(userId,"isRecieved")
//         res.send(result)

//     }catch(err){
//         res.status(405).send(err.msg || err.message || "wrong")

//     }
// })

// router.get('/outgoing',auth, async (req, res) => {
//     try{
//         const userId = req.body.user.id;

//         const result = await emailService.getfilteredEmails(userId,"isSent")
//         res.send(result)

//     }catch(err){
//         res.status(405).send(err.msg || err.message || "wrong")

//     }
// })

// router.get('/deleted',auth, async (req, res) => {
//     try{
//         const userId = req.body.user.id;

//         const result = await emailService.getfilteredEmails(userId,"isDeleted")
//         res.send(result)

//     }catch(err){
//         res.status(405).send(err.msg || err.message || "wrong")

//     }
// })

// router.get('/favorite',auth, async (req, res) => {
//     try{
//         const userId = req.body.user.id;

//         const result = await emailService.getfilteredEmails(userId,"isFavorite")
//         res.send(result)

//     }catch(err){
//         res.status(405).send(err.msg || err.message || "wrong")

//     }
// })


router.post('/:emailId', async (req, res) => {
    try {
        const result = await emailService.addNewMessageToEmail(req.params.emailId, req.body);
        res.send(result);

    } catch (err) {
        res.status(405).send(err.msg || err.message || "wrong")

    }
})


router.put('/:emailId', auth, async (req, res) => {
    try {
        const userEmail = req.body.user.email;
        const emailId = req.params.emailId;
        const state = req.body.state;
        const result = await emailService.updateEmailState(userEmail, emailId, state);
        res.send(result);
    } catch (err) {
        res.status(405).send(err.msg || err.message || "wrong")

    }

})





module.exports = router;