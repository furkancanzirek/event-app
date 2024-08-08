"use client";
import { Drawer } from "vaul";
import { useEffect, useState } from "react";

interface CustomDrawerProps {
  buttonText: string;
  drawerContent: React.ReactNode;
}
export default function CustomDrawer({
  buttonText,
  drawerContent,
}: CustomDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const closeDrawer = () => {
      setIsOpen(false);
    };
    window.addEventListener("resize", closeDrawer);
    return () => {
      window.removeEventListener("resize", closeDrawer);
    };
  }, []);
  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen} shouldScaleBackground>
      <div className="ml-auto">
        <Drawer.Trigger>
          <span className="flex items-center justify-center ml-auto font-medium text-white bg-lightGreen border border-transparent rounded-md hover:bg-lightGreen focus:outline-none focus:ring-2 py-2 px-4 text-sm">
            {buttonText}
          </span>
        </Drawer.Trigger>
      </div>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[11]" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[80%] flex-col rounded-t-lg bg-gray-100 z-50">
          <div className="flex-1 overflow-y-auto rounded-t-lg bg-white">
            <div className="pointer-events-none sticky inset-x-0 top-0 flex h-10 items-center justify-center overflow-hidden bg-white">
              <div className="h-1.5 w-12 shrink-0 rounded-full bg-gray-300" />
            </div>
            <div>{drawerContent}</div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
