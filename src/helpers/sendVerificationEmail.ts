import {resend} from "@/lib/resend";
import VerificationEmail from "@/components/email/VerificationEmail";

export async function sendVerificationEmail(email: string, username:string, verifyCode: string) {
    try {
      const response =  await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Share Thoughts | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        console.log('response email--->', response)
        if(response.error){
            return { success: false, message: response.error.message}
        }
       return { success: true, message: "Verification code sent successfully"}
    } catch (error) {
        console.error("Failed to send Verification code", error)
        return { success: false, message: "Failed to send Verification code"}
    }
}