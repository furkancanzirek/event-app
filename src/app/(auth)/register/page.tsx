"use client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Input from "@/app/components/ui/Input";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { Suspense } from "react";

const schema = z.object({
  name: z.string().min(1, "Fullname is required"),
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  phone: z.string().optional(),
});

const Signup = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onSubmit = async (data: any) => {
    setAuthError(null);
    try {
      const signupResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/signup`,
        {
          email: data.email,
          password: data.password,
          name: data.name,
          phone: data.phone,
        }
      );

      const res = await signIn("credentials", {
        email: signupResponse.data.email,
        password: data.password,
        callbackUrl: callbackUrl || "/",
        redirect: false,
      });

      if (res?.error) {
        setAuthError(res.error);
      } else {
        router.push("/");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        setAuthError(errorMessage as string);
      }
    }
  };

  return (
    <Suspense>
      <div className="flex items-center justify-center min-h-screen w-full text-black py-5 box-border">
        <div className="container flex justify-center w-full h-full my-auto xl:gap-14 mx-6 max-w-4xl rounded-lg py-5 bg-white lg:justify-normal md:gap-5">
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex items-center w-full max-w-lg h-full p-3 px-10">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col w-full h-full pb-6 text-center rounded-3xl"
              >
                <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
                  Sign Up
                </h3>
                <p className="mb-4 text-grey-700">
                  Create your account by filling the form below
                </p>

                <button
                  type="button"
                  onClick={() =>
                    signIn("google", {
                      callbackUrl: callbackUrl || "/",
                    })
                  }
                  className="flex items-center justify-center gap-3 px-4 py-2 text-sm text-center align-middle transition duration-150 rounded ease hover:bg-grey-200"
                >
                  <FcGoogle className="text-2xl" /> Sign in with Google
                </button>

                <div className="flex items-center mb-3">
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                  <p className="mx-4 text-grey-600">or</p>
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                </div>

                {authError && (
                  <div className="mb-4 text-red-600">{authError}</div>
                )}

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      type="text"
                      placeholder="Fullname"
                      label="Fullname*"
                      error={errors.name?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder="mail@loopple.com"
                      label="Email*"
                      error={errors.email?.message}
                      {...field}
                    />
                  )}
                />

                <div className="relative">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        label="Password*"
                        error={errors.password?.message}
                        showPasswordToggle
                        showPassword={showPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        {...field}
                      />
                    )}
                  />
                </div>

                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="phone"
                      type="text"
                      placeholder="Phone"
                      label="Phone (optional)"
                      error={errors.phone?.message}
                      {...field}
                    />
                  )}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center w-full h-12 px-6 text-sm font-medium text-white bg-green-500 rounded-2xl hover:bg-green-600"
                >
                  Sign Up
                </button>

                <Link
                  href="/login"
                  className="text-sm text-[#888] transition duration-150 ease hover:text-black mt-3"
                >
                  Already have an account?
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Signup;
