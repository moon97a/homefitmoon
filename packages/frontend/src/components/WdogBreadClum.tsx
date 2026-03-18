import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react"

import type { MenuPos } from "shared";
import { Link } from "react-router-dom";

interface WgodBreadcrumbProps {
  page : string
}
const WgodBreadcrumb = (
{ 
  page
}: WgodBreadcrumbProps) => 
{
  const [menuPos, setMenuPos] = useState<MenuPos>({ id: '', parent_title: '', title: '', siblings: [] });
  useEffect(() => {
    fetch(`http://localhost:3001/api/get_menu_pos?page=${page}`)
      .then(res => res.json())
      .then(data => {
        setMenuPos(data.data);
      });
  }, [page]);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">홈</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage >{menuPos.parent_title}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-focus">
                  {menuPos.title}
                  <ChevronDownIcon className="size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  {menuPos.siblings.map((sib) => (
                    <DropdownMenuItem key={sib.id}>
                      {sib.id === menuPos.id ? <span className="text-focus">{sib.title}</span> : <Link to={sib.href}>{sib.title}</Link>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>    
    </>
  )
};

export default WgodBreadcrumb;