import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import type { NavItem } from 'shared';

interface WdogNaviProps {
  navItems: NavItem[];
}

export default function WdogNavi({ navItems }: WdogNaviProps) {
  return (
    <div className="flex justify-center self-start pt-6 w-full">
      <NavigationMenu>
        <NavigationMenuList>
          {navItems.map(item => (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuTrigger className={`
                text-xl 
                transition-colors
                ${navigationMenuTriggerStyle()}
              `}>
                {item.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-100 gap-3 p-1 md:w-125 md:grid-cols-2 lg:w-150 list-none">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex gap-2 h-full w-full select-none flex-col justify-start rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="#"
                        onClick={e => e.preventDefault()}
                      >
                        <img src={item.img} alt={item.title} width={300} height={400}  />
                        <p className="text-primary text-sm leading-tight">
                          {item.description}
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  {item.sub_menus.map(sub => (
                    <ListItem href={sub.href} key={sub.id} title={sub.title}>
                      {sub.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ href, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a 
            href={href}
            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            ref={ref}
            {...props}
          >
            <div className="text-lg leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-primary">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
