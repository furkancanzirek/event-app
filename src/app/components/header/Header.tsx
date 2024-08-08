"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { HiMenu } from "react-icons/hi";
import Navigation from "./Navigation";
import ProfileMenu from "./ProfileMenu";
import MobileMenu from "./MobileMenu";
import { Suspense } from "react";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const navigation = [
    { name: "Events", href: "/" },
    ...(session ? [{ name: "My Events", href: "/events/my-events" }] : []),
  ];

  const isLoading = status === "loading";

  return (
    <Suspense fallback={null}>
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 py-3 mx-auto max-w-7xl gap-x-6 lg:px-8"
      >
        <div className="flex flex-1">
          <div className="relative w-full h-8 lg:h-12">
            <Link href="/">
              <Image
                alt="Logo"
                src="/logo.jpeg"
                fill
                className="!w-auto object-fill"
              />
            </Link>
          </div>
        </div>
        <div className="flex-1 hidden lg:block justify-center">
          <Navigation items={navigation} />
        </div>
        <div className="flex-1">
          <ProfileMenu session={session} isLoading={isLoading} />
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <HiMenu className="w-6 h-6" />
            <span className="sr-only">Open main menu</span>
          </button>
        </div>
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          navigation={navigation}
          session={session}
          isLoading={isLoading}
        />
      </nav>
    </header>
    </Suspense>
  );
};

export default Header;
