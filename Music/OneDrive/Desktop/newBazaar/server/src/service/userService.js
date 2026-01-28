import User from '../model/User.js';
import jwtProvider from '../utils/jwtProvider.js';

class UserService {
    async findUserProfileByJwt(jwt) {
        const email = jwtProvider.getEmailFromJwt(jwt);

        const user = await User.findOne({ email }).lean();
        if (!user) {
            throw new Error(`User not found ${email}`);
        }
        return user;
    }

    async findUserByEmail(email) {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            throw new Error(`User not found ${email}`);
        }
        return user;
    }
}

export default new UserService();
