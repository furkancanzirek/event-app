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
import { Suspense } from "react";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Signin = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: callbackUrl || "/",
      redirect: false,
    });

    if (res?.error) {
      setErrorMessage(res.error);
    } else {
      router.push("/");
    }
  };

  return (
    <Suspense fallback="Loading...">
      <div className="flex items-center justify-center w-full min-h-screen text-black">
        <div className="container flex justify-center w-full h-full max-w-4xl py-5 mx-6 my-auto bg-white rounded-lg xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center w-full max-w-lg p-10">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
              >
                <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
                  Sign In
                </h3>
                <p className="mb-4 text-grey-700">
                  Enter your email and password
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

                {errorMessage && (
                  <div className="my-4 text-sm text-red-600">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center w-full h-12 px-6 text-sm font-medium text-white bg-green-500 rounded-2xl hover:bg-green-600"
                >
                  Sign In
                </button>

                <Link
                  href="/register"
                  className="text-sm text-[#888] transition duration-150 ease hover:text-black mt-3 group"
                >
                  Don&apos;t have an account? <span className="font-semibold text-black group-hover:text-lightGreen transition duration-150 ease">Sign up</span>
                </Link>
              </form>
            </div>
           
          </div>
         
        </div>
        
      </div>
    </Suspense>
  );
};

export default Signin;
