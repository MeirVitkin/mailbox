const express = require('express'),
app = express();

require("dotenv").config();
require('./DL/db').connect();
app.use(require('cors')());
app.use(express.json());
app.use('/email',require('./routes/email.router'))
app.use('/user',require('./routes/user.router'))
app.use('/messages',require('./routes/message.router'))

app.listen(5555,()=>{
    console.log("##### server is listening #####");
})
