// ACL = Access Control List
// a term that is often used
// when it comes to limiting access to data
// in a system based on user roles

const aclRules = require('./rules.json');

// FOR NOW OUR ACL SYSTEM CAN ONLY SAYS allowed / not allowed 
// PER ROUTE, but think about this
// * A user should be able to see his/her own orders but not the orders of others users.
// * A user should be able to change his/her data in the customers table but not other users data.
// How do we solve these kind of problem?

module.exports = function (tableName, req) {
  // we need 
  // * the table / viewName(already a parameter)
  // * the user role from the logged in user (otherwise if not logged in - "visitor")
  // * the request method
  let userRole = req.session.user ? req.session.user.userRole : 'visitor';
  let method = req.method.toLowerCase();

  // since we only specify put (not patch) in the rules change patch to put 
  // for the actual used method in order to make it work with our rules
  method = method === 'patch' ? 'put' : method;

  // now can go into the rules and check if a certain REST api-route
  // is allowed for a certain user Role

  // could we use optional chaining (a new operator here to shorten the code)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  let allowed = aclRules?.[userRole]?.[tableName]?.[method];

  // !! = converts undefined to the boolean false, true to true etc
  // (not necessary but being a bit strict here, the method should only return true or false)
  return !!allowed;
}