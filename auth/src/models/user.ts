import mongoose from 'mongoose';
import { Password } from '../services/password';

// user attributes
interface UserAttrs {
  email: string;
  password: string;
}

// extend model with a build function
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// describe properties of a user document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // toJSON: {
    //   transform(doc,ret){
    //     delete ret.password
    //     delete ret.__v
    //     ret.id = ret._id
    //     delete ret._id
    //   }
    // }
  }
);

//format JSON properties
userSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.id = _id;
  return user;
};

// do not use arrow functions here because the context of 'this' is entire file not the
// user document object just created
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// new User({...}) is not supported by type-checking
// have to set a static method with a user attributes interface parameter
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
