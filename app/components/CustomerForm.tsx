"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

export interface DeliveryAddress {
  street: string
  postalCode: string
  city: string
  email: string
  phone?: string
}

const schema = z.object({
  firstName: z.string().min(1, { message: "Fornavn er påkrevd" }),
  lastName: z.string().min(1, { message: "Etternavn er påkrevd" }),
  email: z.string().email("Ugyldig epost"),
  phone: z.union([z.string().min(8, "Telefonnummer er påkrevd"), z.number().min(8, { message: "Telefonnummer er påkrevd" })]),
  address: z.string().min(1, { message: "Adresse er påkrevd" }),
  zipCode: z.union([z.string().min(4, "Postnummer er påkrevd"), z.number().min(4, { message: "Postnummer er påkrevd" })]),
  area: z.string().min(1, { message: "Område er påkrevd" }),
})

type Inputs = z.infer<typeof schema>

interface CustomerFormProps {
  onSubmit: (customerName: string, deliveryAddress?: DeliveryAddress) => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
  includeDeliveryAddress?: boolean
  submitButtonText?: string
  loadingButtonText?: string
}

export default function CustomerForm({
  onSubmit,
  onCancel,
  isLoading = false,
  includeDeliveryAddress = true,
  submitButtonText = "Send inn",
  loadingButtonText = "Sender...",
}: CustomerFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
  })

  const onSubmitForm: SubmitHandler<Inputs> = async (data) => {
    const customerName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim()

    const deliveryAddress: DeliveryAddress | undefined = includeDeliveryAddress
      ? {
          street: data.address.trim(),
          postalCode: String(data.zipCode).trim(),
          city: data.area.trim(),
          email: data.email.trim(),
          phone: data.phone ? String(data.phone).trim() : undefined,
        }
      : undefined

    await onSubmit(customerName, deliveryAddress)
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmitForm)}>
      <div>
        <input
          className="w-full border border-zinc-300 dark:border-zinc-600 rounded-lg p-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          {...register("firstName")}
          placeholder="Fornavn"
          disabled={isLoading}
        />
        <p className="text-red-500 text-sm mt-1">{errors.firstName?.message}</p>
      </div>

      <div>
        <input
          className="w-full border border-zinc-300 dark:border-zinc-600 rounded-lg p-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          {...register("lastName")}
          placeholder="Etternavn"
          disabled={isLoading}
        />
        <p className="text-red-500 text-sm mt-1">{errors.lastName?.message}</p>
      </div>

      <div>
        <input
          type="email"
          className="w-full border border-zinc-300 dark:border-zinc-600 rounded-lg p-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          {...register("email")}
          placeholder="Epost"
          disabled={isLoading}
        />
        <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
      </div>

      <div>
        <input
          type="tel"
          className="w-full border border-zinc-300 dark:border-zinc-600 rounded-lg p-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          {...register("phone")}
          placeholder="Telefonnummer"
          disabled={isLoading}
        />
        <p className="text-red-500 text-sm mt-1">{errors.phone?.message}</p>
      </div>

      <div>
        <input
          className="w-full border border-zinc-300 dark:border-zinc-600 rounded-lg p-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          {...register("address")}
          placeholder="Adresse"
          disabled={isLoading}
        />
        <p className="text-red-500 text-sm mt-1">{errors.address?.message}</p>
      </div>

      <div>
        <input
          className="w-full border border-zinc-300 dark:border-zinc-600 rounded-lg p-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          {...register("zipCode")}
          placeholder="Postnummer"
          disabled={isLoading}
        />
        <p className="text-red-500 text-sm mt-1">{errors.zipCode?.message}</p>
      </div>

      <div>
        <input
          className="w-full border border-zinc-300 dark:border-zinc-600 rounded-lg p-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          {...register("area")}
          placeholder="Postområde"
          disabled={isLoading}
        />
        <p className="text-red-500 text-sm mt-1">{errors.area?.message}</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          Avbryt
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {isLoading ? loadingButtonText : submitButtonText}
        </button>
      </div>
    </form>
  )
}
