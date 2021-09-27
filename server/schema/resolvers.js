const { AuthenticationError } = require('apollo-server-errors');
const { Book, User } = require('../models');
const { signToken } = require('../utils/auth')
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
    login: async (parent, args) => {
      const user = await User.findOne({
        email: args.email
      })
      const checkPassword = await user.isCorrectPassword(args.password)
      if (!checkPassword) {
        throw new AuthenticationError("incorrect credentials")
      };
      const token = signToken(user)
      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { input}, context ) => {
      console.log(context.user)
      
      if (context.user) {
        const updateUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true }
        );
        return updateUser;
      }
      throw new AuthenticationError('You must be logged in')

    },
    removeBook: async (parent, args, context) => {
      console.log(args)
      if (context.user) {
        const updateUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );
        return updateUser;

      }
      throw new AuthenticationError('You must be logged in')


    },
  },
};

module.exports = resolvers;
