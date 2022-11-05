require('dotenv').config(); 
const express = require('express');
const port = process.env.PORT || 9000;
const router = express();
const bcrypt = require('bcryptjs');
const DBHelpers = require('./dbHelpers');
const bodyParser = require('body-parser'); 
router.use(bodyParser.json()); 

const cors = require('cors')
router.use(cors({origin:"*"}))

//Get all users
router.get('/users', (req, res)=>{
    DBHelpers.getallUsers()
    .then(users=>{
        res.status(200).json(users)
    })
    .catch(error=>res.status(500).json(error))
})

//Add new user
router.post('/users/register', (req, res)=>{
    const credentials = req.body; 
    const {username, password} = credentials; 

    if(!(username && password)){
        return res.status(400).json({message:"username and password is required!"})
    }
    //password
    const hash = bcrypt.hashSync(credentials.password, 12);
    credentials.password = hash; 
    DBHelpers.addUser(credentials)
    .then(user=>{
        res.status(200).json(user)
    })
    .catch(error=>{
        if(error.errno === 19){
            return res.status(400).json({message: "user already exist"})
        } else {
            res.status(500).json(error)
        }
    })
})

//Update user id
router.patch('/users/:id', (req, res)=>{
    const {id} = req.params;
    DBHelpers.updateUserId(id, req.body)
    .then(userId=>{
        res.status(200).json({message: 'Name updated'})
    })
    .catch(error=>res.status(500).json(error))
})

//Delete user
router.delete('/users/:id', (req, res)=>{
    const id = req.params.id;
    DBHelpers.removeUser(id)
    .then(count=>{
        if(count > 0){
            res.status(200).json({message:"user is deleted!"})
        } else {
            res.status(200).json({message:"no user with that ID!"})
        }
    })
    .catch(error=>res.status(500).json(error));
})

//Log in with existing user
router.post('/users/login', (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    DBHelpers.findUserByUsername(username, password)
    .then(user=>{
        if(user && bcrypt.compareSync(password, user.password)){
            res.status(200).json(user)
        } else {
            res.status(400).json({message:"user with that password doesn't exist"})
        }
})
.catch(error=>res.status(500).json(error));
})

//Get all saved games
router.get('/savedGames', (req, res)=>{
    DBHelpers.getAllSavedGames()
    .then(destinations=>{
        res.status(200).json(destinations)
    })
    .catch(error=>{
        res.status(500).json({message:'cannot get destinations'})
    })
})

//Create saved game
router.post('/users/:id/savedGames', (req,res)=>{
    const {id} = req.params;
    const newGame = req.body;
    if(!newGame.user_id){
        newGame['user_id'] = parseInt(id, 10); 
    }
    //Find user and send back for saved game
    DBHelpers.findUserByID(id)
    .then(user=>{
        if(!user){
            res.status(404).json({message:'user does not exist'})
        }
        DBHelpers.addGame(newGame, id)
        .then(destination=>{
            res.status(200).json(destination)
        })
        .catch(error=>{res.status(500).json({message: `${error}'server failed'`})
    })
})
})

//Delete saved game
router.delete('/savedGames/:id', (req, res)=>{
    const{id} = req.params; 
    DBHelpers.removeSavedGames(id)
    .then(count=>{
        if(count>0){
        res.status(200).json({message: 'Game is deleted'})
    } else {
        res.status(404).json({message: 'No Game with that id'})
    }
})
    .catch(error=>res.status(500).json(error))
})

//Add image url to user
router.post('/users/:id/imageUrl', (req,res)=>{
    const {id} = req.params;
    const newImg = req.body;
    if(!newImg.user_id){
        newImg['user_id'] = parseInt(id, 10); 
    }
    //Find user and send back for saved game
    DBHelpers.findUserByID(id)
    .then(user=>{
        if(!user){
            res.status(404).json({message:'user does not exist'})
        }
        DBHelpers.addGame(newImg, id)
        .then(destination=>{
            res.status(200).json(destination)
        })
        .catch(error=>{res.status(500).json({message: `${error}'server failed'`})
    })
})
})



router.get('/', (req, res)=>{
  res.status(200).json({message:"Welcome to the server"});
}); 

router.listen(port, ()=>{
  console.log(`Server running at port http://localhost:${port}`); 
}) 

module.exports = router; 