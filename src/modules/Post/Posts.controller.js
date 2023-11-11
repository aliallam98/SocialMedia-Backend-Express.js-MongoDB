import postModel from "../../../DB/models/Post.model.js";
import { ErrorClass } from "../../utils/ErrorClass.js";
import {
  dateHandler,
  deleteOneById,
  getOneById,
} from "../../utils/Reuseable.js";
import { ApiFeatures } from "../../utils/api.features.js";
import cloudinary from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/errorHandling.js";

// getAllPostsWithTheirComments (Child - Parent)
export const getAllPostsWithTheirComments = asyncHandler(
  async (req, res, next) => {
    // user that has isDeleted equal true can’t get posts cannot login and here we can add where condition to hide his posts in allposts Api
    // Try This To Handle Filter(createdAt) http://localhost:5000/post/?page=1&size=5&createdAt[gte]=2023-09-27&createdAt[lt]=2023-09-29
    const apiFeatures = new ApiFeatures(postModel.find({
    }).populate([
      {
        path: "createdBy",
        // select:"firstName lastName email status isDeleted -_id"
      },
      {
        path: "comments",
        // select:"firstName lastName email status isDeleted -_id"
      },
    ]), req.query)
      .pagination(postModel)
      .filter()
    let posts = await apiFeatures.mongooseQuery
    // let posts = await postModel.find().populate('createdBy');
    // posts = posts.filter(post => post.createdBy.isDeleted !== true);
    const data = {
      totalDocuments: apiFeatures.queryData.totalDocuments,
      totalPages: apiFeatures.queryData.totalPages,
      nextPage: apiFeatures.queryData.next,
      prevPage: apiFeatures.queryData.previous,
      currentPage: apiFeatures.queryData.currentPage,
      resultsPerPage: posts.length,
    };
    // const postWithComments = await postModel
    //   .find({ isDeleted: false })
    //   .populate({
    //     path: "comments",
    //   });
    
    

    return res.status(200).json({ message: "Done",data, posts });
  }
);

// Add new Post
export const addNewPost = asyncHandler(async (req, res, next) => {
  //Handle createdby field in BD
  req.body.createdBy = req.user._id;
  //Handle post images and videos upload options
  console.log(req.files);
  if (req.files ) {
    //If there is an images
    if (req.files.images) {
      const images = [];
      for (let i = 0; i < req.files.images.length; i++) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          req.files.images[i].path,
          { folder: `SocialMedia/${req.user._id}/Posts/images` }
        );
        images.push({ secure_url, public_id });
        req.body.images = images;
      }
    }
    //If there is a videos
    if (req.files.videos) {
      const videos = [];
      for (let i = 0; i < req.files.videos.length; i++) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          req.files.videos[i].path,
          { folder: `SocialMedia/${req.user._id}/Posts/videos` }
        );
        videos.push({ secure_url, public_id });
        req.body.videos = videos;
      }
    }
  }

  //create Post
  const post = await postModel.create(req.body);
  return res.status(201).json({ message: "Done", post });
});
//Update Post And Instead of create new endpoint for update privacy we can do in here
export const updatePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const isExistPost = await postModel.findById(id);
  if (!isExistPost) return next(new ErrorClass("This Post Is Not Exist", 404));
  //check Is Authurazition or not to do call this endpoint (owner only do that)
  if(isExistPost.createdBy.toString() !== req.user._id.toString()) return next(new ErrorClass("Not Auth To update This Post", 401));
  if (req.files.images) {
    const images = [];
    for (let i = 0; i < req.files.images.length; i++) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.images[i].path,
        { folder: `SocialMedia/${req.user._id}/Posts/images` }
      );
      images.push({ secure_url, public_id });
      }
      req.body.images = images;
      if (isExistPost.images) {
        for (let i = 0; i < isExistPost.images.length; i++) {
          await cloudinary.uploader.destroy(isExistPost.images[i].public_id);
        }
      }
    }

  if (req.files.videos) {
    const videos = [];
    for (let i = 0; i < req.files.images.length; i++) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.videos[i].path,
        { folder: `SocialMedia/${req.user._id}/Posts/videos` }
      );
      videos.push({ secure_url, public_id });
      }
      req.body.videos = videos;

      if (isExistPost.videos) {
        for (let i = 0; i < isExistPost.videos.length; i++) {
          await cloudinary.uploader.destroy(isExistPost.images[i].public_id);
        }
      }
  }

  const post = await postModel.findByIdAndUpdate(id,req.body,{new:true})

  return res.status(200).json({ message: "Done", post });
});

// deletePost
export const deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // const isExistPost = await postModel.findByIdAndDelete({_id:id, createdBy:req.user._id});
  const isExistPost = await postModel.findById(id);
  if (!isExistPost) return next(new ErrorClass("This Post Is Not Exist", 404));
  if(isExistPost.createdBy.toString() !== req.user._id.toString()) return next(new ErrorClass("Not Auth To update This Post", 401));


  if (isExistPost.images) {
    for (let i = 0; i < isExistPost.images.length; i++) {
      await cloudinary.uploader.destroy(isExistPost.images[i].public_id);
    }
  }
  if (isExistPost.videos) {
    for (let i = 0; i < isExistPost.videos.length; i++) {
      await cloudinary.uploader.destroy(isExistPost.videos[i].public_id);
    }
  }
  
   await postModel.findByIdAndDelete(id)
  return res.status(200).json({ message: "Deleted Successfully" });
});


//Get Post By ID
export const getPostById = getOneById(postModel);

//Only Logged In Users Can => (Like-Unlike)
export const postLikesHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await postModel.findById(id);
  if (!post) {
    return next(new ErrorClass("This Post is Not Exist", 404));
  }

  // i will user save() method and we can handle it by addtoset and pull
  if (!post.likes.includes(req.user._id)) {
    post.likes.addToSet(req.user._id);
    post.save();
  } else {
    post.likes.pull(req.user._id);
    post.save();
  }
  return res.status(200).json({ message: "Done", post });
});

// Send Date(today,yesterday,last7days,last30days) in body or (startDateRange,startDateRange) to get data in specific date or range data
export const dateFilter = asyncHandler(async (req, res, next) => {
  const today = new Date();
  const yesterday = new Date(today - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  let startDateRange = new Date(req.body.startDateRange);
  let endDateRange = new Date(req.body.endDateRange);

  if (req.body.date) {
    if (req.body.date == "Today") {
      startDateRange = today;
      endDateRange = tomorrow;
    }
    if (req.body.date == "Yesterday") {
      startDateRange = yesterday;
      endDateRange = today;
    }
    if (req.body.date == "Last 7 Days") {
      startDateRange = last7Days;
      endDateRange = today;
    }
    if (req.body.date == "Last 30 Days") {
      startDateRange = last30days;
      endDateRange = today;
    }
  }
  const date = dateHandler(startDateRange, endDateRange);

  const postDateFilter = await postModel.find({
    createdAt: { $gte: date.startDate, $lt: date.endtDate },
  });
  return res.status(200).json({ message: "Done", postDateFilter });
});
