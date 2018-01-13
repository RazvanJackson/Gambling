const UserDB = require('../model/user');

class Validation{
    static match(req,res){
        let username = req.body.username;
        let password = req.body.password;

        if(username && password){
            UserDB.findOne({username:username}, function(err,user){
                if(err) res.json({message:'System error!', error:true});
                else if(user){
                    UserDB.comparePasswords(password, user.password, function(err,isMatch){
                        if(err) res.json({message:'System error!', error:true});
                        if(!isMatch) res.json({error:true});
                        else return res.json({error:false});
                    })
                }
            });
        }
    }
}

module.exports = Validation