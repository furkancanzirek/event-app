"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseEventTicket } from "@/app/actions/purchaseEventAction";
import { useState } from "react";
import Alert from "@/app/components/ui/Alert";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Input from "@/app/components/ui/Input";

const schema = z.object({
  fullName: z.string().min(1, "Name on card is required"),
  cardNumber: z.string().length(16, "Card number must be 16 digits"),
  expiry: z.string().length(5, "Expiration date must be MM/YY"),
  cvv: z.string().length(3, "CVV must be 3 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "ZIP / Postal code is required"),
  paymentId: z.string(),
});

type FormValues = z.infer<typeof schema>;

const MyForm = ({ paymentId }: { paymentId: string }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      address: "",
      city: "",
      region: "",
      postalCode: "",
      paymentId: paymentId,
    },
  });

  const onSubmit = async (data: FormValues) => {
    let res = (await purchaseEventTicket(data)) as any;
    if (!res.success) {
      setError(JSON.parse(res.error).message);
    } else {
      toast.success(res.result.message);
      router.push("/events/my-events");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl px-10 pt-6 pb-12 mx-auto lg:max-w-none border rounded-lg"
    >
      {error && (
        <Alert className="mb-3" title="Error" message={error} type="error" />
      )}
      <div className="flex flex-col gap-y-4">
        <div>
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="fullName"
          >
            Name on card
          </label>
          <Input className="!mb-2" type="text" id="fullName" {...register("fullName")} />

          {errors?.fullName && (
            <small className="text-red-400 mb-3">
              {errors.fullName.message}
            </small>
          )}
        </div>
        <div>
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="cardNumber"
          >
            Card number
          </label>
          <Input className="!mb-2" type="text" id="cardNumber" {...register("cardNumber")} />

          {errors?.cardNumber && (
            <small className="text-red-400 mb-3">
              {errors.cardNumber.message}
            </small>
          )}
        </div>
        <div>
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="expiry"
          >
            Expiration date (MM/YY)
          </label>
          <Input className="!mb-2" type="text" id="expiry" {...register("expiry")} />

          {errors?.expiry && (
            <small className="text-red-400 mb-3">{errors.expiry.message}</small>
          )}
        </div>
        <div>
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="cvv"
          >
            CVV
          </label>
          <Input className="!mb-2" type="text" id="cvv" {...register("cvv")} />

          {errors?.cvv && (
            <small className="text-red-400 mb-3">{errors.cvv.message}</small>
          )}
        </div>
        <div>
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="address"
          >
            Address
          </label>
          <Input className="!mb-2" type="text" id="address" {...register("address")} />

          {errors?.address && (
            <small className="text-red-400 mb-3">
              {errors.address.message}
            </small>
          )}
        </div>
        <div>
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="city"
          >
            City
          </label>
          <Input className="!mb-2" type="text" id="city" {...register("city")} />

          {errors?.city && (
            <small className="text-red-400 mb-3">{errors.city.message}</small>
          )}
        </div>
        <div>
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="region"
          >
            State/Province
          </label>
          <Input className="!mb-2" type="text" id="region" {...register("region")} />

          {errors?.region && (
            <small className="text-red-400 mb-3">{errors.region.message}</small>
          )}
        </div>
        <div>
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="postalCode"
          >
            ZIP / Postal code
          </label>
          <Input className="!mb-2" type="text" id="postalCode" {...register("postalCode")} />

          {errors?.postalCode && (
            <small className="text-red-400 mb-3">
              {errors.postalCode.message}
            </small>
          )}
        </div>
        <Input id="paymentId" type="hidden" {...register("paymentId")} value={paymentId} />
        <button
          type="submit"
          className="inline-flex  items-center px-4 py-2 ml-auto text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-lightGreen  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default MyForm;
