const app = require('express')();

// prettify json
app.set('json spaces', 2);

// import routes
require('./routes/usta')(app);

// start server
app.listen(3401, () => console.log("Listening on port 3401"));
