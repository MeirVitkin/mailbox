const express = require('express'),
    router = express.Router();
const userService = require('../BL/user.service');
const { auth } = require('../middelweres/auth');

router.all('/protected',auth,async(req, res) => {
    res.send(req.body.user);
})

router.get('/:userId',auth,async (req, res) => {
    try{
        const user = await userService.getUser(req.params.userId);
        res.send(user);
    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")

    }

})

router.post('/login', async (req, res)=>{
    try {
        const data = req.body
        const {user , token} = await userService.login(data);
        res.send({user, token});
        
    } catch (error) {
        res.status(500).send({msg:'login failed'})
    }

} )
router.post('/register', async (req, res)=>{
    try {
        await userService.register(req.body);
        res.send(true);
        
    } catch (error) {
        res.status(500).send({msg:'register failed' })
    }

} )

module.exports = router;
