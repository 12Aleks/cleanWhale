import React from 'react';
import {useForm} from "react-hook-form";
import {AuthSchema} from "../lib/zodSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {login} from "../action/authAction";
import { useNavigate } from "react-router-dom";

export interface IAuth {
    email: string;
    password: string;
}

const FormComponent = () => {
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<IAuth>({
        resolver: zodResolver(AuthSchema)
    });
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationKey: ['login'],
        mutationFn: login,
        onSuccess: () => { navigate("/admin") },
        onError: () => {
            alert('The email or password is incorrect.');
        },
    })

    const onSubmit = (data: IAuth) => {
        const result  = AuthSchema.safeParse(data);
        if (!result.success) return alert('Data is not correct');
        mutation.mutate( result.data);
    }

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-3 justify-center w-full max-w-[400px] p-3
        rounded bg-transparent text-white border-2 border-white
          [&_input]:p-2 [&_input]:rounded [&_input]:bg-white [&_input]:w-full [&_input]:text-black
          [&_p]:text-red-500 [&_p]:text-sm [&_p]:mt-1.5
        ">
            <h2 className="text-xl font-bold mb-4 text-center">Login to the system:</h2>
            <input type="email"
                   placeholder="Enter your email"
                   {...register('email')}
            />
            {errors.email && <p>{errors.email.message}</p>}
            <input type="password"
                   placeholder="Enter your password"
                   {...register('password')}/>
            {errors.password && (<p>{errors.password.message}</p>)}
            <button type="submit" className="w-full max-w-[80%] my-3 bg-blue-500 hover:bg-blue-700
             duration-200 text-white p-2 rounded cursor-pointer" >
                {isSubmitting ? "Logging in..." : "Login"}
            </button>
        </form>

    );
};

export default FormComponent;