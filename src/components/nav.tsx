import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "./themeToggle";

const LINKS: { label: string; to: string }[] = [
  { label: "Calculator", to: "/" },
  { label: "Settings", to: "/settings" },
  { label: "Backup", to: "/backup" },
];

export function Nav() {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 border-b pb-3">
      <NavigationMenu>
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
                      "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      isActive &&
                        "bg-accent text-accent-foreground focus:text-accent-foreground",
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
      <ThemeToggle />
    </div>
  );
}
