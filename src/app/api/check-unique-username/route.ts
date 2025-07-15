import dbConnect from "@/lib/dbConnect";
import {NextRequest} from "next/server";
import {usernameValidationSchema} from "@/validationSchemas/signUpSchema";
import {z} from 'zod'
const userValidationSchema = z.object({
    username: usernameValidationSchema
})
export async function GET(request: NextRequest){
    await dbConnect()
    const {searchParams} = new URL(request.url)
    const username = searchParams.get("username")
    const result = userValidationSchema.safeParse({username})

    console.log('result-->', result)

}