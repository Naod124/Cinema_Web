// import the express-session module
// that lets us use session together with express
const session = require('express-session');

// import at 'store' to use with express-session
// (so that sessions are stored in our database 
// and not lost on server restart)
const store = require('better-express-store');

// Import/require the acl module (the determines which route are allowed for a certain userRole)
const acl = require('./acl');

// import the password encryptor
const passwordEncryptor = require('./passwordEncryptor');

// What's the name of the password column?
const passwordField = 'password';


// export the code as a module
module.exports = function (app, db) {

  // register the express-session module as a express middleware
  app.use(session({
    secret: 'someUnusualStringThatIsUniqueForThisProject',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' },
    store: store({ dbPath: './DB/Filmvisarna.sqlite3' })
  }));

  // setting up some /api/login routes that will be used
  // in order to make it possible for a user to log in and out

  // The post route /api/login is used to login
  app.post('/api/login', (req, res) => {
    if (!acl('login', req)) {
      res.status(405);
      res.json({ _error: 'Not allowed' });
    }
    // Encrypt the password
    req.body[passwordField] =
      passwordEncryptor(req.body[passwordField]);
    // Look for a user/customer based on email in the database
    let stmt = db.prepare(`
      SELECT * FROM customers
      WHERE username = :username AND password = :password
    `);
    // Either we get an array with one element (success)
    // or an array with 0 elements (failure) back
    // - convert that array to a user object or an error object/message
    let result = stmt.all(req.body)[0] || { _error: 'No such user.' };
    // Delete the password property from the result
    delete result.password;
    // If the login is a sucess store the user in our session
    // (the session is unique for each connection)
    if (!result._error) {
      req.session.user = result;
    }
    // Respond
    res.json(result);
  });

  // The get route /api/login is used to check if someone is logged in
  app.get('/api/login', (req, res) => {
    if (!acl('login', req)) {
      res.status(405);
      res.json({ _error: 'Not allowed' });
    }
    res.json(req.session.user || { _error: 'Not logged in' });
  });

  // The delete route /api/login is used to logout the user
  app.delete('/api/login', (req, res) => {
    if (!acl('login', req)) {
      res.status(405);
      res.json({ _error: 'Not allowed' });
    }
    delete req.session.user;
    res.json({ success: 'logged out' });
  });

}

// FUTURE REFACTORING?
// Would it be better to refactor to use runQuery (from rest-api.js)
// for these 3 specific routes as well?
// Disadvantage: These routes do not operate as common routes
// we use runQuery for - 2 of them do not run ad db query...