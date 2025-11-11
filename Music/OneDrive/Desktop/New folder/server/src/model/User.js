import mongoose from "mongoose";
import UserRoles from '../domain/UserRole.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
    },
    addresses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    role: {
        type: String,                           // ✅ Type defined
        enum: [UserRoles.CUSTOMER, UserRoles.ADMIN], // ✅ Allowed values
        default: UserRoles.CUSTOMER             // ✅ Default value
    }
});

const User = mongoose.model("User", userSchema);
export default User;
