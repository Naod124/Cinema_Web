//require the password encryptor
const passwordEncryptor = require('./passwordEncryptor');

//Determines which route are allowed for a certain userRole
const acl = require('./acl');
const { STATUS_CODES } = require('http');


// Which table stores user data and name of password column
const userTable = 'customers';
const passwordField = 'password';
const userRoleField = 'userRole';

// Global variable for our database connection
let db;

// creating prepared statements
// running them with catching any errors
function runQuery(tableName, req, res, parameters, sqlForPreparedStatement, onlyOne = false) {

  //  return "not allowed" if the user is not allowed to fetch data from this table
  if (!acl(tableName, req)) {
    res.status(405);
    res.json({ _error: 'Not allowed!' });
    return;
  }

  let result;
  try {
    let stmt = db.prepare(sqlForPreparedStatement);
    // use the method all if the query starts with SELECT
    // otherwise use the method run
    let method = sqlForPreparedStatement.trim().toLowerCase().indexOf('select') === 0 ?
      'all' : 'run';
    result = stmt[method](parameters);
  }
  catch (error) {
    // Catch the error into an object
    // with _error and convert the error to a string
    result = { _error: error + '' };
  }
  if (onlyOne) { result = result[0]; }
  result = result || null;
  res.status(result ? (result._error ? 500 : 200) : 404);
  res.json(result);
}

// Export the function setupRESTapi as a Node.js module
module.exports = function setupRESTapi(app, databaseConnection) {

  // Store the database connection in the global variable db
  db = databaseConnection;

  // Get the names of all the tables in the db
  let tablesAndViews = db.prepare(`
  SELECT name, type 
  FROM sqlite_schema
  WHERE 
    (type = 'table') 
    AND name NOT LIKE 'sqlite_%'
`).all();

  // This route will list all the tables and views
  app.get('/api/tablesAndViews', (req, res) => {
    // Here we dont use runQuery
    if (!acl('tablesAndVies', req)) {
      res.status(405);
      res.json({ _error: 'Not allowed!' });
    }
    res.json(tablesAndViews);
  });

  // Loop through all tables and views and create REST-routes for them
  for (let { name, type } of tablesAndViews) {

    // Create a route to get (read) all posts from a table
    app.get('/api/' + name, (req, res) => {
      runQuery(name, req, res, {}, `
        SELECT *
        FROM ${name}
      `);
    });

    // Create a route to get a single post from a table based on its id
    app.get('/api/' + name + '/:userName', (req, res) => {
      // Create a prepared statement with a parameter :userName as part of it
      runQuery(name, req, res, req.params, `
        SELECT *
        FROM ${name}
        WHERE userName = :userName
      `, true);
    });

    // Add a post route for the table
     app.post ('/api/' + name, (req, res) => {
      // if this is the user table then encrypt the password
      if (name === userTable) {
       //changes the user role to just "user"
        req.body[userRoleField] = 'user';
        // encrypt the password
        req.body[passwordField] =
          passwordEncryptor(req.body[passwordField]);
      }
      
      console.log(req.body);
    runQuery(name, req, res, req.body, `
        INSERT INTO ${name} (${Object.keys(req.body)})
        VALUES (${Object.keys(req.body).map(x => ':' + x)})`
      );
    });

    // And put/patch routes
    let putAndPatch = (req, res) => {

      // if this is the customer table then encrypt the password
      if (name === userTable && req.body[passwordField]) {
        // encrypt the password
        req.body[passwordField] =
          passwordEncryptor(req.body[passwordField]);
      }
      // do not allow changing user roles through the REST-api
      delete req.body[userRoleField];
      runQuery(name, req, res, { ...req.body, ...req.params }, `
        UPDATE ${name}
        SET ${Object.keys(req.body).map(x => x + ' = :' + x)}
        WHERE id = :id
      `);
    };

   //same logic for both put and patch
    app.put('/api/' + name + '/:id', putAndPatch);
    app.patch('/api/' + name + '/:id', putAndPatch);

    // delete routes
    app.delete('/api/' + name + '/:id', (req, res) => {
      runQuery(name, req, res, req.params, `
        DELETE FROM ${name}
        WHERE id = :id
      `);
    });
    app.get('/api/my-tickets', (req, res) => {
      console.log("WHAAT?");
      // check for a logged in user
      // optional chainging ?. -> only if there is a user try to read user.id
      let userId = req.session.user?.username;
      console.log(userId);
      // Run a query (and return the result) that will show the user
      // his/her orders - but not any one elses orders
      runQuery('my-tickets', req, res, { customerId: userId }, `
      SELECT tickets.id, tickets.seatNum, tickets.date ,tickets.totalPrice,tickets.saloonId,tickets.customerId,movies.title ,salons.name ,cinema.cityName
      FROM tickets
      INNER JOIN movies,salons,cinema ON tickets.movieId=movies.id AND tickets.saloonId=salons.id AND tickets.cinemaId=cinema.id WHERE customerId = :customerId;
      `);
      
    
    }); 
    app.delete('/api/my-tickets', (req, res) => {
      console.log("Delete?");
      // check for a logged in user
      // optional chainging ?. -> only if there is a user try to read user.id
      let userId = req.session.user?.username;
      let id = req.body["id"];
      console.log(id);
      console.log(userId);
      // Run a query (and return the result) that will show the user
      // his/her orders - but not any one elses orders
      runQuery('tickets', req, res, { customerId: userId ,id:id }, `
      DELETE FROM tickets
      WHERE customerId = :customerId AND 
            id = :id;
      `);
      
    
    });

  }
 
  // Add a 404 route to the api
  // (will only match the request if no other routes matches it,
  //  since this routes is declared last)
  app.all('/api/*', (req, res) => {
    res.status(404);
    res.json({ _error: 'No such route!' });
  });

  // Add our own middleware to catch errors occuring because
  // of invalid JSON syntax in request bodies
  // (note: runs for every query)
  app.use((error, req, res, next) => {
    if (error) {
      let result = {
        _error: error + ''
      };
      res.json(result);
    }
    else {
      // calling next will say "this middleware will not handle the response"
      next();
    }
  });

}