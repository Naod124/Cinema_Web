const knex = require("./Connect"); 


function getUser(usernamn, pass){
try {
    return knex("Customers").
    where({username : usernamn, password: pass}).select(usernamn); 
} catch (error) {
    if(error instanceof DatabaseError) {
       return 0; 
      }
}
}

function getFilmDetails(id){
    try{
        return knex("Movies").
        where({id : id}).select(title, desc, duration, artistName, director, releaseDate);
    } catch (error) {
        if(error instanceof DatabaseError){
            return 0;
        }
    }
}

module.exports = {
    getUser,
    getFilmDetails
}