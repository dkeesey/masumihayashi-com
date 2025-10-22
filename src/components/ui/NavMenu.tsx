import * as React from "react"
import HamburgerMenuIcon from "../HamburgerMenuIcon"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "./sheet"
import { ChevronDown } from "lucide-react" // Still needed for mobile accordion

// Artwork series for mega menu
const artworkSeries = [
  {
    name: "Japanese American Internment Camps",
    shortName: "Internment Camps",
    path: "/artwork/japanese-american-internment-camps/",
    count: 37,
    description: "Photo collages documenting WWII incarceration sites"
  },
  {
    name: "Sacred Architectures",
    shortName: "Sacred Architectures",
    path: "/artwork/sacred-architectures/",
    count: 33,
    description: "Asian temples and spiritual sites"
  },
  {
    name: "Post-Industrial Landscapes",
    shortName: "Post-Industrial",
    path: "/artwork/post-industrial/",
    count: 13,
    description: "Rust Belt and urban decay"
  },
  {
    name: "Prisons & Institutions",
    shortName: "Prisons",
    path: "/artwork/prisons/",
    count: 9,
    description: "Sites of confinement and incarceration"
  },
  {
    name: "War & Military Sites",
    shortName: "War & Military",
    path: "/artwork/war-military/",
    count: 6,
    description: "Cold War installations and military bases"
  },
  {
    name: "EPA Superfund Sites",
    shortName: "EPA Superfund",
    path: "/artwork/epa-superfund/",
    count: 11,
    description: "Environmental cleanup locations"
  },
  {
    name: "City Works",
    shortName: "City Works",
    path: "/artwork/city-works/",
    count: 13,
    description: "Urban architecture and public spaces"
  },
  {
    name: "Public Commissions",
    shortName: "Commissions",
    path: "/artwork/commissions/",
    count: 16,
    description: "Commissioned public artworks"
  },
]

// Top-level navigation structure
const topNavData = [
  {
    name: "Artwork",
    path: "/artwork/",
    hasMegaMenu: true,
  },
  {
    name: "Exhibitions",
    path: "/exhibitions/",
  },
  {
    name: "Videos",
    path: "/videos/",
  },
  {
    name: "Resources",
    path: "/resources/",
  },
  {
    name: "About",
    path: "/about/",
  },
  {
    name: "Support Our Mission",
    shortName: "Donate",
    path: "/donate/",
    className: "nav-cta"
  },
]

const NavLinks = () => {
  const [pathname, setPathname] = React.useState("");
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <NavigationMenuList className="hidden lg:flex lg:gap-6 items-center">
      {topNavData.map((item) => (
        <NavigationMenuItem key={item.path} className={item.className === 'nav-cta' ? 'ml-4' : ''}>
          {item.hasMegaMenu ? (
            // Artwork with mega menu
            <>
              <NavigationMenuTrigger
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50"
                onMouseEnter={() => setOpenMenu(item.name)}
                onFocus={() => setOpenMenu(item.name)}
              >
                {item.name}
              </NavigationMenuTrigger>
              <NavigationMenuContent
                onMouseLeave={() => setOpenMenu(null)}
                className="w-screen"
              >
                <div className="w-full bg-white shadow-lg border-t border-gray-200">
                  <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Artwork Galleries</h3>
                      <p className="text-sm text-gray-600">Explore Masumi Hayashi's panoramic photo collages across 8 thematic series</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {artworkSeries.map((series) => (
                        <NavigationMenuLink key={series.path} asChild>
                          <a
                            href={series.path}
                            className="group block p-4 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-baseline justify-between mb-1">
                              <h4 className="font-medium text-gray-900 group-hover:text-primary-interactive-link text-sm">
                                {series.shortName}
                              </h4>
                              <span className="text-xs text-gray-500">{series.count}</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">{series.description}</p>
                          </a>
                        </NavigationMenuLink>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <a
                        href="/artwork/"
                        className="text-sm font-medium text-primary-interactive-link hover:text-primary-interactive-hover"
                      >
                        View All Artworks →
                      </a>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </>
          ) : pathname === item.path ? (
            <span className="text-sm md:text-base italic px-4 py-2">
              {item.name}
            </span>
          ) : (
            <a
              href={item.path}
              className={`text-sm md:text-base no-underline transition-all duration-300 ${
                item.className === 'nav-cta'
                  ? 'border-2 border-amber-600 text-amber-600 rounded-full hover:bg-amber-600 hover:text-white font-medium xl:px-4 xl:py-1.5 lg:px-3 lg:py-1'
                  : 'inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 hover:bg-gray-100 hover:text-gray-900'
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
  const [artworkOpen, setArtworkOpen] = React.useState(false);

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
          className="w-[300px] sm:w-[400px] bg-white overflow-y-auto"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <nav className="flex flex-col gap-2 pt-4">
            {/* Artwork Accordion */}
            <div className="border-b border-gray-200 pb-2">
              <button
                onClick={() => setArtworkOpen(!artworkOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-lg text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-300"
              >
                <span>Artwork</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${artworkOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {artworkOpen && (
                <div className="pl-4 mt-2 space-y-1">
                  {artworkSeries.map((series) => (
                    <a
                      key={series.path}
                      href={series.path}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                    >
                      <div className="flex items-baseline justify-between">
                        <span>{series.shortName}</span>
                        <span className="text-xs text-gray-500">{series.count}</span>
                      </div>
                    </a>
                  ))}
                  <a
                    href="/artwork/"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-primary-interactive-link hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  >
                    View All →
                  </a>
                </div>
              )}
            </div>

            {/* Other top-level items */}
            {topNavData.filter(item => !item.hasMegaMenu).map((item) => (
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
                      item.className === 'nav-cta'
                        ? 'block text-center mx-4 mt-6 mb-2 border-2 border-amber-600 text-amber-600 rounded-full px-6 py-4 hover:bg-amber-600 hover:text-white font-medium transition-all duration-300 text-lg'
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
        <a href="/" className="text-2xl uppercase tracking-wider no-underline hover:opacity-80 transition-opacity">
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
