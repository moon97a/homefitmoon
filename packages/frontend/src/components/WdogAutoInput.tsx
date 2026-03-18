import { useState, useCallback, useRef, useEffect } from "react"
import { useDebounce } from "use-debounce"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { Search, X, Loader2, MoveRight } from "lucide-react"
import type { NavSubItem } from 'shared';

interface WdogAutoInputProps {
  placeholder?: string
  onValueChange?: (value: string, item?: NavSubItem) => void  // 당신의 기존 props
}

export default function WdogAutoInput({
  placeholder = "메뉴 검색...",
  onValueChange
}: WdogAutoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")  // 당신의 기존 변수명
  const [navItems, setNavItems] = useState<NavSubItem[]>([])
  const [debouncedValue] = useDebounce(searchValue, 300)
  const [loading, setLoading] = useState(false)

  const fetchNavItems = useCallback(async (key: string) => {
    if (key.length < 2) {
      setNavItems([])
      return
    }

    setLoading(true)
    try {
      fetch('http://localhost:3001/api/search_menus?key=' + encodeURIComponent(key))
        .then(res => res.json())
        .then(data => {
          if(open === false) {
            setOpen(true)
          }
          setNavItems(data.data);  // 👈 바로 사용!
        });
    } catch (error) {
      console.error("메뉴 검색 실패:", error)
      setNavItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNavItems(debouncedValue)
  }, [debouncedValue, fetchNavItems])

  const navigate = useNavigate()  
  const handleSelect = useCallback((item: NavSubItem) => {
    onValueChange?.(item.title, item)
    setOpen(false)
    navigate(item.href)
  }, [navigate, onValueChange]) 
    
  const clearInput = () => {
    setSearchValue("")
    setNavItems([])
    onValueChange?.("", undefined)
    inputRef.current?.focus()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-md">
          <Input
            ref={inputRef}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          {searchValue && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-full p-0 max-h-96"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        sideOffset={5}
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder="메뉴 검색..."
            className="w-65 h-12"
          />
          
          <CommandList className="max-h-75">
            <CommandEmpty>
              {loading ? (
                <div className="flex items-center gap-2 py-8 text-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  검색 중...
                </div>
              ) : searchValue ? (
                `${searchValue} 관련 메뉴 없음`
              ) : (
                "검색어를 입력하세요"
              )}
            </CommandEmpty>
            
            <CommandGroup>
              {navItems.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item)}
                  className="cursor-pointer px-4 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                      <MoveRight className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 w-56">
                      <p className="font-medium truncate">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </p>
                      )}
                    </div>

                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
