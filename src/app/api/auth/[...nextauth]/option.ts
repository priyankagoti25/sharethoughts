import {NextAuthOptions} from "next-auth";
import CredentialProviders from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
export const authOptions: NextAuthOptions ={
    providers:[
        CredentialProviders({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credential:any) :Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credential?.email},
                            {email: credential?.email}
                        ]
                    })
                    if(!user){
                        throw new Error('No user found with this email')
                    }
                    if(!user.isVerified) {
                        throw new Error('Verify your account first')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credential?.password ||"", user.password)

                    if(!isPasswordCorrect){
                        throw new Error('Incorrect password')
                    }
                    return user
                } catch (err:any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id?.toString()
                session.user.username = token.username
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}