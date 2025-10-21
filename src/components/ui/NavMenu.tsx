import * as React from "react"
import HamburgerMenuIcon from "../HamburgerMenuIcon"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@components/ui/sheet"

const navData = [
  {
    name: "Internment Camps Gallery",
    path: "/artwork/japanese-american-internment-camps/",
  },
  {
    name: "Family Album",
    path: "/family-album-project/",
  },
  {
    name: "Historical Documents",
    path: "/historical-documents/",
  },
  {
    name: "Artist Statement",
    path: "/artist-statement/",
  },
  {
    name: "About",
    path: "/about/",
  },
  {
    name: "Support Our Mission",
    shortName: "Donate",
    path: "/donate/",
    className: "border-2 border-amber-600 text-amber-600 rounded-full px-4 py-1.5 hover:bg-amber-600 hover:text-white font-medium transition-all duration-300"
  },
]

const NavLinks = () => {
  const [pathname, setPathname] = React.useState("");

  React.useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <NavigationMenuList className="hidden lg:flex lg:gap-8 items-center">
      {navData.map((item) => (
        <NavigationMenuItem key={item.path} className={item.className ? 'ml-4' : ''}>
          {pathname === item.path ? (
            <span className="text-sm md:text-base italic">
              {item.name}
            </span>
          ) : (
            <a
              href={item.path}
              className={`text-sm md:text-base no-underline transition-all duration-300 ${
                item.className === 'nav-cta' 
                  ? 'border-2 border-amber-600 text-amber-600 rounded-full hover:bg-amber-600 hover:text-white font-medium xl:px-4 xl:py-1.5 lg:px-3 lg:py-1'
                  : 'hover:text-primary-bg-primary/50'
              }`}
            >
              {item.className === 'nav-cta' ? (
                <span>
                  <span className="hidden xl:inline">{item.name}</span>
                  <span className="xl:hidden">{item.shortName}</span>
                </span>
              ) : (
                item.name
              )}
            </a>
          )}
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  );
};

const MobileNav = () => {
  const [pathname, setPathname] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            className="group flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white"
            aria-label="Toggle Menu"
          >
            <HamburgerMenuIcon className="h-6 w-6 text-gray-600" />
          </button>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-[300px] sm:w-[400px] bg-white"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <nav className="flex flex-col gap-4 pt-4">
            {navData.map((item) => (
              <div key={item.path}>
                {pathname === item.path ? (
                  <span className="block px-4 py-2 text-lg italic text-gray-500">
                    {item.name}
                  </span>
                ) : (
                  <a
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={
                      item.className === 'border-2 border-amber-600 text-amber-600 rounded-full px-4 py-1.5 hover:bg-amber-600 hover:text-white font-medium transition-all duration-300'
                        ? 'block text-center mx-4 mt-6 mb-2 border-2 border-amber-600 text-amber-600 rounded-full px-6 py-4 hover:bg-amber-600 hover:text-blue-50 font-medium transition-all duration-300 text-lg'
                        : 'block px-4 py-2 text-lg text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-300'
                    }
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export function NavMenu() {
  return (
    <NavigationMenu className="relative z-50 w-full">
      <div className="flex justify-between items-center px-4 py-4">
        <a href="/" className="text-2xl uppercase tracking-wider">
          MASUMI HAYASHI
        </a>
        <div className="flex items-center gap-4">
          <NavLinks />
          <MobileNav />
        </div>
      </div>
    </NavigationMenu>
  );
}
