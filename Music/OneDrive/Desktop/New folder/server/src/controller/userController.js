import UserService from '../service/userService.js';

class UserController {
    async getUserProfileByJwt(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const user = await UserService.findUserProfileByJwt(token);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getUserByEmail(req, res) {
        try {
            const { email } = req.params;
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            const user = await UserService.findUserByEmail(email);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new UserController();
