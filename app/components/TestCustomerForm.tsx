"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const schema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email" }),
    phone: z.number().min(1, { message: "Phone number is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    zipCode: z.number().min(1, { message: "Zip code is required" }),
    area: z.string().min(1, { message: "Area is required" }),
})

type Inputs = z.infer<typeof schema>


export default function TestCustomerForm() {


    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<Inputs>({ resolver: zodResolver(schema) });
    console.log(errors)



    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(data)
    }

    return (
        <div>
            <h1>Test Customer Form</h1>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}
            >
                <input className="border p-4" {...register("firstName", { required: "First name is required" })} placeholder="First Name" />
                <p className="text-red-500">{errors.firstName?.message}</p>
                <input className="border p-4" {...register("lastName", { required: "Last name is required", minLength: { value: 2, message: "Last name must be at least 2 characters long" } })} placeholder="Last Name" />
                <p className="text-red-500">{errors.lastName?.message}</p>
                <input className="border p-4" {...register("email", {
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email"
                    },
                    required: "Invalid email"
                })} placeholder="Email" />
                <p className="text-red-500">{errors.email?.message}</p>
                <input className="border p-4" {...register("phone", { required: "Vennligst skriv inn telefonnummer", minLength: { value: 2, message: "" } })} placeholder="Telefonnummer" />
                <p className="text-red-500">{errors.phone?.message}</p>
                <input className="border p-4" {...register("lastName", { required: "Last name is required", minLength: { value: 2, message: "Last name must be at least 2 characters long" } })} placeholder="Last Name" />
                <p className="text-red-500">{errors.lastName?.message}</p>
                <input className="border p-4 hover:bg-blue-500 hover:cursor-pointer" type="submit" />


            </form >
        </div>
    )
}