import Seller from "../model/Seller.js";
import VerificationCode from "../model/VerificationCode.js";
import  sendVerificationEmail  from "../utils/sendEmail.js";
import { generateOTP } from "../utils/generateOtp.js";


class AuthService{
    async sendSignInOtp(email){

        const SIGNIN_PREFIX='signin_'
        if (email.startsWith(SIGNIN_PREFIX)) {   
            const seller =await Seller.findOne({email});
            if (!seller) {
                throw new Error('user not found')    
            }
        }

        const existingVerificationCode=await VerificationCode.findOne({email})
        
        if(existingVerificationCode)await VerificationCode.deleteOne({email})
        const otp=generateOTP()
       await new VerificationCode({email,otp}).save()

    //    send email
    await sendVerificationEmail(
        email, 
        "Your Login OTP",
        `<p>Your OTP for login is: <b>${otp}</b>. It is valid for 10 minutes.</p>`
    );

    }
}

export default AuthService;