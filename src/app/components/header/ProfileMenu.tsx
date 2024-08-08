import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/libs/utils";

interface ProfileMenuProps {
  session: { user: { name: string; image: string } } | null;
  isLoading: boolean;
  isMobileMenuOpen?: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  session,
  isLoading,
  isMobileMenuOpen = false,
}) => {
  return (
    <div
      className={cn(
        "items-center  flex-1 gap-x-6 flex",
        isMobileMenuOpen ? "justify-center" : "justify-end"
      )}
    >
      {isLoading ? (
        <div className="flex items-center gap-x-3">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : session ? (
        <div className="flex items-center gap-x-3">
          {session.user.image && (
            <Image
              alt="Profile Picture"
              src={session.user.image}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}

          <span className="text-sm font-semibold leading-6 text-gray-900">
            {session.user.name}
          </span>
          <button
            type="button"
            onClick={() => signOut()}
            className="text-sm font-semibold leading-6 bg-black text-white rounded-full px-4 py-1.5"
          >
            Log out
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-lightGreen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lightGreen"
          >
            Sign in
          </Link>
        
          <Link
            href="/register"
            className="px-3 py-2 text-sm hidden lg:block font-semibold text-white rounded-md shadow-sm bg-black  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black "
          >
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
