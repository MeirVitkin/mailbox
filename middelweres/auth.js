async function auth(req, res, next) {
    try{
        let token = req.headers.authorization?.split('Bearer ')[1];
        let user = {_id: "6614e0b92018f4d5b33dd95d", email: "user1@example.com"};
        req.body.user = user;
        next();
    }catch{
        res.sendStatus(401);
    }
    
}

module.exports = {auth}