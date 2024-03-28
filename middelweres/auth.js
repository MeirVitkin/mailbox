async function auth(req, res, next) {
    try{
        let token = req.headers.authorization?.split('Bearer ')[1];
        let user = {id: "6602c49ceb02aca8db6f826f", email: "user2@example.com"};
        req.body.user = user;
        next();
    }catch{
        res.sendStatus(401);
    }
    
}

module.exports = {auth}