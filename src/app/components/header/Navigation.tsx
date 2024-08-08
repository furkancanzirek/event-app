import { cn } from "@/libs/utils";
import Link from "next/link";

interface NavigationProps {
  items: { name: string; href: string }[];
  onLinkClick?: () => void;
  mobileMenuOpen?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  items,
  onLinkClick,
  mobileMenuOpen = false,
}) => {
  return (
    <div
      className={cn(
        "flex",
        mobileMenuOpen ? "flex-col" : "lg:flex justify-center",
        "gap-x-12"
      )}
    >
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            " font-semibold leading-6 text-gray-900",
            mobileMenuOpen ? "block text-xl text-center py-6" : "lg:inline-block text-sm" 
          )}
          onClick={onLinkClick}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
