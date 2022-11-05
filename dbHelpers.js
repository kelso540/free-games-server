// const knex = require('knex'); 
// const config = require('./knexfile'); 
// const db = knex(config.development);

const db = require('./dbConfig'); 

function getallUsers(){
    return db('users'); 
}
async function addUser(user){
    await db('users').insert(user)
    return db('users').where({username:user.username})
}
function removeUser(id){
    return db('users').where({id:id}).del(); 
}
function updateUserId(id, newName){
    return db('users').where({id:id}).update(newName)
}
function findUserByID(id){
    return db('users').where({id:id}).first();
}
function findUserByUsername(username){
    return db('users').where({username:username}).first(); 
}
function getAllSavedGames(){
    return db('savedGames'); 
}
async function addGame(newGame, user_id){
    await db('savedGames')
    .where({user_id:user_id})
    .insert(newGame, ['id'])
}
async function addImg(newImg, user_id){
    await db('imageUrl')
    .where({user_id:user_id})
    .insert(newImg, ['id'])
}
function removeSavedGames(id){
    return db('savedGames').where({id:id}).del()
}

module.exports = {
    getallUsers,
    addUser, 
    getAllSavedGames,
    addGame,
    removeUser, 
    removeSavedGames,
    findUserByID,
    findUserByUsername,
    addImg,
    updateUserId,
}