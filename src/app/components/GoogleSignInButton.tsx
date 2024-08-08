import React from "react";
import { signIn } from "next-auth/react";
import { BiLogoGoogle } from "react-icons/bi";
import { useSearchParams } from "next/navigation";
const GoogleSignInButton: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <button
      type="button"
      disabled={disabled}
      className="flex py-2 px-4 text-sm text-center align-middle justify-center items-center rounded transition duration-150 ease gap-3 hover:bg-grey-200"
      onClick={() => signIn("google", { callbackUrl: callbackUrl || "/" })}
    >
      <BiLogoGoogle className="text-2xl" /> Sign up with Google
    </button>
  );
};

export default GoogleSignInButton;
