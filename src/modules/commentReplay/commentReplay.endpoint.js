import { roles } from "../../middleware/auth.js";
export const endpoint = {
    addComment: [roles.user],
    likes: [roles.user],
    addProfileCoverImage: [roles.user],

};
