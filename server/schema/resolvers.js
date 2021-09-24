const { AuthenticationError } = require('apollo-server-errors');
const { Book, User } = require('../models');
const {signToken} = require('../utils/auth')
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      const userData = await User.findOne({
        _id: context.user._id
      })
      return userData 
    }
  },
  Mutation: {
    login: async (parent,args)=>{
      const user = await User.findOne({
        email: args.email
      })
    const checkPasword= await user.iscorrectpassword(args.password)
    if(!checkPassword){
      throw new AuthenticationError("incorrect credentials")
    }
    const token = signToken(user)
    return {token,user}
  }
   
    },
  },
};

module.exports = resolvers;
