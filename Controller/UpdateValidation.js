const UserDB = require('../model/user');

class Validation{
    static emailValidation(req,res,callback){
        const email = req.body.email;
        const emailRegExp = new RegExp('^'+email+'$', 'i');

        req.checkBody('email', 'Invalid email').isEmail();
        let error = req.validationErrors();
    
        UserDB.findOne({email:emailRegExp}, (err,email)=>{
            if(err){
                if(res!=null)return callback(false),res.json({message:'System error!', error:true});
                else return callback(false);
            } 
            else if(email){
                if(res!=null)return callback(false),res.json({message:'Email already in use!', error:true});
                else return callback(false);
            } 

            else if(error != false){
                if(res!=null)   return callback(false),res.json({message:error[0].msg, error:true});
                else return callback(false);
            }

            else{
                if(res!=null)   return callback(true),res.json({message:"Valide email!", error:false});
                else return callback(true);
            } 
        });
    }
    static usernameValidation(req,res,callback){
        const username = req.body.username;
        const usernameRegExp = new RegExp('^'+username+'$', 'i');

        req.checkBody('username').isAlphanumeric().withMessage('Only letters and numbers');
        req.checkBody('username').isLength({min:3, max:13}).withMessage('The length must be between 3 and 13 characters');
        let error = req.validationErrors();

        UserDB.findOne({username:usernameRegExp}, (err,user)=>{
            if(err){
                if(res!=null)return callback(false),res.json({message:'System error!', error:true});
                else return callback(false);
            }
            else if(user){
                if(res!=null)return callback(false),res.json({message:'Username already in use!', error:true});
                else return callback(false);
            }  
            else if(error != false){
                if(res!=null)   return callback(false),res.json({message:error[0].msg, error:true});
                else return callback(false);
            }
            else{
                if(res!=null)   return callback(true),res.json({message:"Valide Username!", error:false});
                else return callback(true);
            } 
        });
    }
    static confirmPasswordValidation(req,res,callback){
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if(password == confirmpassword){
            if(res!=null) return callback(true),res.json({message:"Passwords match!", error:false});
            else return callback(true);
        } 
        else{
            if(res!=null) return callback(false),res.json({message:"Passwords don't match!", error:true});
            else return callback(false);
        }  
    }
    static checkAll(req,res,next){
        const email = req.body.email;
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if(email){
            this.emailValidation(req,null,function(data){
                if(data==true){
                    UserDB.findOne({_id:req.user._id}, function(err,user){
                        if(err) res.json({message:'System error!', error:true});
                        else{
                            user.email = email;
                            user.save(function(err){
                                if(err) res.json({message:'System error!', error:true});
                                res.json({message:'You have succesfully updated your account!', error:false});
                            });
                        }
                    });
                }
            });
        }
    
        if(password && confirmpassword){
            this.confirmPasswordValidation(req,null,function(data){
                if(data==true){
                    UserDB.findOne({_id:req.user._id}, function(err,user){
                        if(err) res.json({message:'System error!', error:true});
                        else{
                            UserDB.hashPassword(password, function(hash){
                                user.password = hash;
                                user.save(function(err){
                                    if(err) res.json({message:'System error!', error:true});
                                    res.json({message:'You have succesfully updated your account!', error:false});
                                });
                            });
                        }
                    });
                }
                else{
                    res.json({message:'All fields must be valide!', error:true});
                }
            });
        }
    }
}

module.exports = Validation