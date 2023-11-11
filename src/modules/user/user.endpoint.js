import { roles } from "../../middleware/auth.js";
export const endpoint = {
    getProfile: [roles.user],
    delete: [roles.user],
    updatePassword: [roles.user],
    updateProfile: [roles.user],
    addProfileImage: [roles.user],
    addProfileCoverImage: [roles.user],

};
