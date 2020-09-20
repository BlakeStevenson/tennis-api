// import dependencies
const serverless = require('serverless-http');
const app = require('express')();

// prettify json
app.set('json spaces', 2);

// import routes
require('./routes/usta')(app);

module.exports.handler = serverless(app);
// start server
//app.listen(process.env.EXPRESS_PORT, () => console.log("Listening on port " + process.env.EXPRESS_PORT));