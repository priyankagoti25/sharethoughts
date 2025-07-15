import {sendVerificationEmail} from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs"
import {loadWebpackHook} from "next/dist/server/config-utils";
import dbConnect from "@/lib/dbConnect";
export async function POST(request: Request){
    await dbConnect()
    try {
        const { username, email, password } = await request.json()
        const existingVerifiedUserByUsername = await UserModel.findOne({username, isVerified: true})
        if(existingVerifiedUserByUsername) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username is taken"
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        const hashedPassword = await bcrypt.hash(password, 10)
        const verifyCodeExpiry = new Date()
        verifyCodeExpiry.setHours(verifyCodeExpiry.getHours()+1)
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "User is already exists with this email"
                    },
                    {
                        status: 400
                    }
                )
            }
            else {
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry
                await existingUserByEmail.save()
            }
        } else {

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry,
                messages: []
            })
            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail(email,username, verifyCode)
        // console.log('emailResponse-->', emailResponse)
        if(!emailResponse.success){
            return NextResponse.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            )
        }
        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email"
            },
            {
                status: 201
            }
        )
    } catch (error) {
        console.error("Error registering user", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}