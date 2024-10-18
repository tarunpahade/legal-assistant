/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";



 interface SignUp {
    name: string;
    password: number;
    userType: string;
  }
  


export default function SignUp() {
    const router = useRouter()
    const [user, setUser] = useState({
        email: "",
        password: "",

    })
    const [userAlreadyExists] = useState(false)

    const handleSignUp = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const data = {
            ...user,
        }
   
        try {
            const response = await axios.post("api/user/newUser", data);
            console.log(response);

            router.push('/login')


        } catch (error: any) {
            console.log(error);
            alert('Error:' + error)
        }

    }



    return (
        <div className="absolute top-0 w-full h-full bg-white">


            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">
                        Sign up to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  
                        <form className="space-y-6" onSubmit={handleSignUp}  >
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 ">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input

                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        required
                                        className="block w-full p-2 rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>


                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 ">
                                        Enter Password
                                    </label>

                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                                        required
                                        className="block w-full p-2 rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>

                            </div>




                            <div>
                                <label htmlFor="dueDate" className="block text-sm font-medium leading-6 text-gray-900">
                                    Continue As
                                </label>
                                
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                


                    <a href="/login" className="flex w-full justify-center mt-4 font-semibold text-indigo-600 hover:text-indigo-500">
                        Already Have A Account? Login Here
                    </a>
                    {userAlreadyExists === true ? <label className="block text-sm font-medium leading-6 mt-5 "> User Already Exists Login !!!</label> : null}
                </div>
            </div>
        </div>
    )
}