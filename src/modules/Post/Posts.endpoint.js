import { roles } from "../../middleware/auth.js";
export const endpoint = {
    addNewPost: [roles.user],
    addProfileImage: [roles.user],
    addProfileCoverImage: [roles.user],
    delete: [roles.user],
    likes: [roles.user],

};
