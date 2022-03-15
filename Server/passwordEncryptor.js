// crypto module of Node.js
const crypto = require('crypto');

// salt for encryption
const salt = 'ThisIsOurSaltAndNoOneShouldSeeItUnlessWeGiveThePermissonFor,GotItDaniel?';

module.exports = function (password) {
  if (typeof password !== 'string') { return null; } // secure?
  return crypto
    .createHmac('sha256', salt) // choose algorithm and salt
    .update(password)  // send the string to encrypt
    .digest('hex'); // decide on output format (in our case hexadecimal)
}