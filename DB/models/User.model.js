import mongoose, { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    name: String ,
    firstName:  String ,
    lastName:  String ,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    confirmEmail: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    role: {
      type: String,
      required: true,
      enum: ["User","Admin"],
      default: "User",
    },
    status: {
      type: String,
      default: "Offline",
      enum: ["Online", "Offline", "Blocked","SoftDeleted"],
    },
    OTP: {
      type: String,
    },
    OTPNumber: {
      type: Number,
      default: 0,
    },
    posts: [{ type: Types.ObjectId, ref: "Post" }],
    friendsRequests: [{ type: Types.ObjectId, ref: "User" }],
    friends: [{ type: Types.ObjectId, ref: "User" }],
    profileImage:{secure_url:String,public_id:String},
    profileCover:[{secure_url:String,public_id:String}],
  },
  {
    timestamps: true,
  }
);

//Use Mongoose MiddleWare(Hooks) To Create First,Last(Name) Before Save (UserData) In DB
userSchema.pre("save",function(){
  console.log(this);
  this.firstName = this.name.split(' ')[0]
  this.lastName = this.name.split(' ')[1]
})



const userModel = mongoose.model.User || model("User", userSchema);

export default userModel;
