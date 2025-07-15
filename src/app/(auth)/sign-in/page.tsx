"use client"
import React from 'react';
import {useSession,signIn, signOut} from "next-auth/react";

const SignInPage = () => {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button className="bg-blue-500 px-2 py-1 m-4 rounded" onClick={() => signIn()}>Sign in</button>
        </>
    )
};

export default SignInPage;