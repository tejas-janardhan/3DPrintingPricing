import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const LINKS: { label: string; to: string }[] = [
  { label: "Calculator", to: "/" },
  { label: "Backup", to: "/backup" },
];

export function Nav() {
  return (
    <NavigationMenu className="mb-4">
      <NavigationMenuList>
        {LINKS.map((link) => (
          <NavigationMenuItem key={link.to}>
            <NavigationMenuLink asChild>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-50 focus:bg-gray-800 focus:text-gray-50",
                    isActive && "bg-gray-800 text-gray-50",
                  )
                }
              >
                {link.label}
              </NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
