const express = require('express'),
    router = express.Router();
const userService = require('../BL/user.service');
const { auth } = require('../middelweres/auth');


router.get('/:userId',auth,async (req, res) => {
    try{
        const user = await userService.getUser(req.params.userId);
        res.send(user);
    }catch(err){
        res.status(405).send(err.msg || err.message || "wrong")

    }

})

module.exports = router;
