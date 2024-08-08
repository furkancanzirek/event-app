import Link from "next/link";
import Image from "next/image";
import { HiX } from "react-icons/hi";
import Navigation from "./Navigation";
import ProfileMenu from "./ProfileMenu";

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  navigation: { name: string; href: string }[];
  session: { user: { name: string; image: string } } | null;
  isLoading: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  navigation,
  session,
  isLoading,
}) => {
  return (
    <div
      className={`${mobileMenuOpen ? "block" : "hidden"} fixed inset-0 z-10`}
    >
      <div className="fixed inset-0 z-10" />
      <div className="fixed inset-y-0 right-0 z-10 w-screen overflow-y-auto bg-white px-6 py-6 sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <div className="relative h-12 w-full">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Image
                alt="Logo"
                src="/logo.jpeg"
                fill
                className="!w-auto h-8 object-fill "
              />
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Close menu</span>
            <HiX className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <Navigation
              items={navigation}
              onLinkClick={() => setMobileMenuOpen(false)}
              mobileMenuOpen={true}
            />
            <div className="py-6 flex justify-center">
              <ProfileMenu session={session} isLoading={isLoading} isMobileMenuOpen={mobileMenuOpen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
