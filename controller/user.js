const user = require('../model/user');
const { getToken } = require('../utility/jwt');
const signup = async(req,res)=>{
    try{
        const {username, password} = req.body;
        const findUser = await user.findOne({username:username.toLowerCase()});
        console.log("🚀 ~ file: user.js ~ line 7 ~ signup ~ findUser", findUser)
        if(findUser){
            res.status(401).send({message:'User already exist'});
        }
        const newUser = new user({
            username: username.toLowerCase(),
        });
        newUser.password = newUser.generateHash(password);
        const data = await newUser.save();
        res.status(200).send({message:'User SignUp succesfully', data, success: true});
    }catch(err){
        res.send({message: err.message, success: false});
        console.log(err);
    }
};

const login = async(req,res)=>{
    try{
        const {username, password} = req.body;
        const findUser = await user.findOne({username:username.toLowerCase()});
        if(!findUser){
            res.status(404).send({message:'Invalid user name or password'});
        }
        if(!findUser.validPassword(password)){
            res.status(404).send({message:'Invalid password'});
        }
        const token = await getToken({
            id: findUser._id,
            username: findUser.username,
        });
        const data = {user:findUser,token};
        res.status(200).send(data);
        return;
        
    }catch(err){
        console.log('err==>',err);
        res.send({message: err.message});
    }
};

const getAllUser = async(req,res)=>{
    try{
        const data = await user.find({},{username:1});
        res.json(data);
    }catch(err){
        res.json({message:err.message});
        console.log('err',err);
    }
}

module.exports = {
    signup,
    login,
    getAllUser
}