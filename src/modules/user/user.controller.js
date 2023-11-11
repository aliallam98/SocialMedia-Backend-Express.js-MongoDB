import userModel from "../../../DB/models/User.model.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import { compare, hash } from "../../utils/HashAndCompare.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import CryptoJS from "crypto-js";
import otpGenerator from "otp-generator";
import { createHTML, sendEmail } from "../../utils/email.js";
import { generateToken } from "../../utils/GenerateAndVerifyToken.js";
import { URL, checkUserBasices, getOneById } from "../../utils/Reuseable.js";
import cloudinary from "../../utils/cloudinary.js";
import { ApiFeatures } from "../../utils/api.features.js";

//signUP
export const signUP = asyncHandler(async (req, res, next) => {
  //Receive Data from body
  let { name, email, password, phone, age } = req.body;

  //Check ih this email existing in db or not
  const isEmailExist = await userModel.findOne({ email });
  if (isEmailExist)
    return next(new ErrorClass("This Email Already In Use", 409));

  //Hash Password
  password = hash({ plaintext: password });
  //Encrypt Phone
  phone = CryptoJS.AES.encrypt(phone, process.env.CRYPTOKEY).toString();

  //Send Confimation Mail ////

  // Generate random number
  const OTP = generateOTPWithExpireDate();
  // Insert otp number into html page that will send by mail
  const html = createHTML(OTP);
  // sendEmail({to:email ,subject:"Confirmation Mail",text:"Please Click The Below Link To Confirm Your Email",html})
  if (
    !sendEmail({
      to: email,
      subject: "Confirmation Mail",
      text: "Please Click The Below Link To Confirm Your Email",
      html,
    })
  ) {
    return next(new ErrorClass("There is someting Wrong with Email Sender"));
  }

  //   if(req.file){
  //     const { secure_url, public_id } = await cloudinary.uploader.upload(
  //         req.file.path,
  //         { folder: `E-commerce/Users/${req.body.firstName + req.body.lastName}` }
  //       );
  //       req.body.image = { secure_url, public_id }
  //  }

  //Create New User Using Constroctor to handle it in mongoose MiddleWare
  const newUser = new userModel({ name, email, password, phone, age, OTP });
  const user = await newUser.save();
  return res.status(201).json({ message: "Done", user });
});

//confirmUser
export const confirmUser = asyncHandler(async (req, res, next) => {
  const { email, OTP } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ErrorClass("This Email Is Not Exist", 404));
  }
  if (user.confirmEmail)
    return next(
      new ErrorClass(
        "This Email Already Confimred ... Go To Login In Page",
        400
      )
    );
  if (user.OTP !== OTP) {
    return next(new ErrorClass("In Vaild OTP", 400));
  }
  const newOTP = otpGenerator.generate(10);
  const confirmUser = await userModel.findOneAndUpdate(
    { email },
    { confirmEmail: true, OTP: newOTP },
    { new: true }
  );
  return res.status(201).json({ message: "Done", confirmUser });
});

//login
// refresh token
export const logIn = asyncHandler(async (req, res, next) => {
  //Receive Data from body
  let { email, password } = req.body;

  //Check isEmailExist
  const isEmailExist = await userModel.findOne({ email });
  if (!isEmailExist)
    return next(new ErrorClass("Email Or Password Is Wrong", 401));

  //Check IsVaildPassword
  const IsVaildPassword = compare({
    plaintext: password,
    hashValue: isEmailExist.password,
  });
  if (!IsVaildPassword)
    return next(new ErrorClass("Email Or Password Is Wrong", 401));

  //Check IsEmailConfirmed
  //Check isDeleted
  //Check Status
  checkUserBasices(isEmailExist, next);

  // General Payload and Token
  const payload = {
    id: isEmailExist._id,
    name: isEmailExist.name,
    email: isEmailExist.email,
  };

  const token = generateToken({ payload });

  const refreshToken = generateToken({ payload, expiresIn: 60 * 60 * 24 * 7 });
  await userModel.findOneAndUpdate(
    { email: isEmailExist.email },
    { status: "Online" }
  );

  return res
    .status(200)
    .json({ message: "Done", token: token, refreshToken: refreshToken });
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(userModel.find(), req.query)
    .pagination(userModel)
    .filter();
  const users = await apiFeatures.mongooseQuery;
  const data = {
    totalDocuments: apiFeatures.queryData.totalDocuments,
    totalPages: apiFeatures.queryData.totalPages,
    nextPage: apiFeatures.queryData.next,
    prevPage: apiFeatures.queryData.previous,
    currentPage: apiFeatures.queryData.currentPage,
    resultsPerPage: posts.length,
  };
  return res.status(200).json({ message: "Done", data, users });
});

//Get User Profile By Id  (Send Id in Params)
export const getProfileById = getOneById(userModel);

//Get Loggin Profile
export const getloggedInProfile = asyncHandler(async (req, res, next) => {
  const userProfile = await userModel.findById(req.user._id);
  return res.status(200).json({ message: "Done", userProfile });
});

// update Profile
export const softDelete = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, { status: "SoftDeleted" });
  return res.status(200).json({ message: "Done" });
});
// SoftDelete

//forget password
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  //Check isEmailExist
  const isEmailExist = await userModel.findOne({ email });
  if (!isEmailExist) return next(new ErrorClass("Email Is Wrong", 404));

  //Check IsEmailConfirmed
  //Check isDeleted
  //Check Status
  checkUserBasices(isEmailExist, next);

  if (isEmailExist.OTPNumber >= process.env.MAXOTPSMS)
    return next(new ErrorClass("Already Sent Check Your Mail", 403));

  //Send OTP By NodeMailer
  const OTP = otpGenerator.generate(process.env.OTPNUMBERS, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  if (
    !sendEmail({
      to: email,
      subject: "Forget Password Mail",
      text: `Your Password Reset Code Is :${OTP} Click This Link To reset Your Password ${URL(
        req
      )}/user/resetpassword`,
    })
  ) {
    return next(new ErrorClass("There is someting Wrong with Email Sender"));
  }

  isEmailExist.OTP = OTP;
  isEmailExist.save();
  //Change OTP After 2mins

  setTimeout(async () => {
    const newOTP = otpGenerator.generate(process.env.NEWOTPNUMBERS, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    await userModel.findOneAndUpdate(
      { email: isEmailExist.email },
      { OTP: "newOTP" }
    );
    console.log("OTP Is Changed");
  }, 2 * 60 * 1000);

  await userModel.findByIdAndUpdate(isEmailExist._id, {
    $inc: { OTPNumber: 1 },
  });
  return res.status(200).json({ message: "Check Your Email" });
});
//Reset Password
export const resetPassword = asyncHandler(async (req, res, next) => {
  let { email, OTP, newPassword } = req.body;
  //Check isEmailExist
  const isEmailExist = await userModel.findOne({ email });
  if (!isEmailExist) return next(new ErrorClass("Email Is Wrong", 404));
  //Check OTP
  if (isEmailExist.OTP !== OTP)
    return next(new ErrorClass("In Vaild OTP", 400));

  newPassword = hash({ plaintext: newPassword });
  const newOTP = otpGenerator.generate(10);

  await userModel.findOneAndUpdate(
    { email },
    { password: newPassword, OTP: newOTP, OTPNumber: 0 }
  );

  return res.status(200).json({ message: "Your New Password Has Set" });
});

//updatePassword User Must Be Loggin  old !== new
export const updatePassword = asyncHandler(async (req, res, next) => {
  let { oldPassword, newPassword } = req.body;
  const IsVaildoldPassword = compare({
    plaintext: oldPassword,
    hashValue: req.user.password,
  });
  if (!IsVaildoldPassword)
    return next(new ErrorClass("Old password is Wrong", 400));

  console.log(oldPassword, newPassword);
  if (oldPassword == newPassword) {
    return next(
      new ErrorClass("Cannot Change New Password To Old Password", 409)
    );
  }

  newPassword = hash({ plaintext: newPassword });

  await userModel.findByIdAndUpdate(req.user._id);
  return res.status(200).json({ message: "Password Changed" });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, age, phone, email } = req.body;
  if (email && email !== req.user._id) {
    const checkEmail = await userModel.findOne({ email });
    if (checkEmail)
      return next(new ErrorClass("This Email Already In Use", 409));
    const OTP = otpGenerator.generate(process.env.OTPNUMBERS, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    if (
      !sendEmail({
        to: email,
        subject: "Forget Password Mail",
        text: `Your Password Reset Code Is :${OTP} Click This Link To reset Your Password ${URL(
          req
        )}/user/confrimemail`,
      })
    ) {
      return next(new ErrorClass("There is someting Wrong with Email Sender"));
    }
  }

  const updateUserInfo = await userModel.findByIdAndUpdate(
    req.user._id,
    { name, age, phone, email, confirmEmail: false, OTP },
    { new: true }
  );
  return res.status(200).json({ message: "Done", updateUserInfo });
});

// Upload Profile Pic And In Case There Is Old Pic Will Delete Then Add New
export const addProfileImage = async (req, res, next) => {
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `SocialMedia/${req.user._id}/profileImage` }
    );
    req.body.image = { secure_url, public_id };
    if (req.user.profileImage.public_id) {
      await cloudinary.uploader.destroy(req.user.profileImage.public_id);
    }
  }
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { profileImage: req.body.image },
    { new: true }
  );
  res.json({ message: "Done", user });
};
// Upload Profile Cover Pic And In Case There Is Old Pic Will Add To Z Array As Object And Can Select Between Then
export const addProfileCoverImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `SocialMedia/${req.user._id}/profileCoverImage` }
    );
    req.body.image = { secure_url, public_id };
  }
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { $push: { profileCover: req.body.image } },
    { new: true }
  );
  res.json({ message: "Done", user });
});

// Add Video for Post
//Done in Post Apis

//Send Friend Request

export const sendFriendRequest = async (req, res, next) => {
  const { id } = req.params;

  //chech id
  const isIdExist = await userModel.findById(id);
  if (!isIdExist)
    return next(new ErrorClass("This Profile Id Is Not Exist", 404));
  const addRequest = await userModel.findByIdAndUpdate(req.user._id, {
    $addToSet: { friendsRequests: id },
  });

  return res.json({ message: "Done", addRequest });
};
export const cancelFriendRequest = async (req, res, next) => {
  const { id } = req.params;

  //chech id
  const isIdExist = await userModel.findById(id);
  if (!isIdExist)
    return next(new ErrorClass("This Profile Id Is Not Exist", 404))

    if(!isIdExist.friendsRequests.includes(id)) return next(new ErrorClass(`Your and ${isIdExist.name} are not friends`))
    await userModel.findByIdAndUpdate(req.user._id, {
      $pull: { friendsRequests: id },
    },{new:true});



  return res.json({ message: "Done"});
};
