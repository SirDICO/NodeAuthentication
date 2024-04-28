import User from '../models/User.js'
import {StatusCodes} from 'http-status-codes'
import {BadRequestError, NotFoundError, UnAuthenticatedError} from '../errors/index.js'


const register = async(req, res) =>{
        const {fullname, username, email, password} = req.body

        if(!fullname || !username || !email  || !password){
            throw new BadRequestError('Please provide all values')
        }

        const userEmailAlreadyExists = await User.findOne({email});
        const userUsernameAlreadyExists = await User.findOne({username});
        if(userEmailAlreadyExists  || userUsernameAlreadyExists){
            throw new BadRequestError('Email or Username already in use')
        }

        const user = await User.create({fullname, username, email, password})
        const token = user.createJWT()

        res.status(StatusCodes.CREATED).json({user:{email:user.email, fullname:user.fullname, username:user.username},
           token })

}
const login = async(req, res) =>{
    const {email, password} = req.body

    if(!email || !password){
        throw new BadRequestError('Please provide all values')
    }

    const user =await User.findOne({email}).select('+password')
    if(!user){
        throw new UnAuthenticatedError('Invalid Credentials')
    }
    console.log(user)
   const isPasswordCorrect = await  user.comparePassword(password)
   if(!isPasswordCorrect){
    throw new UnAuthenticatedError('Invalid Credentials')
}

 const token = user.createJWT();
user.password = undefined;
res.status(StatusCodes.OK).json({user, token, location:user.location})
}
const updateUser = async(req, res) =>{
  const {email, name, lastName, location} = req.body;
  if(!email || !name || !lastName || !location){
    throw new BadRequestError('Please provide all values')
  }

  const user = await User.findOne({_id: req.user.userId})


  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT()

    res.status(StatusCodes.OK).json({user, token, location: user.location})
}

export {register, login, updateUser}