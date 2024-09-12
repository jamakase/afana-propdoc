"use client"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import MainSidebar from "./MainSidebar"
import { MessagesSquare, PanelLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sideBarData = [
  {id: 1, name: 'Список чатов', icon: MessagesSquare, href: '/conversations'},
  {id: 2, name: 'Поиск по документам', icon: Search, href: '/search'},
];

export function MainLayout({children}: {children?: any}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-screen min-w-screen bg-white">
      <MainSidebar data={sideBarData}/>
      <div className="flex flex-col w-full h-screen md:pl-16">
        
        <header className="sticky top-0 z-30 flex min-h-14 h-14 items-center gap-4 border-b bg-background px-4 md:static md:hidden md:border-0 md:bg-transparent md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
              <h4 className="text-2xl font-bold text-black">AFANA</h4>
              {sideBarData.map((item) => (
                <Link
                  key={item.id}
                    href={item.href}
                  >
                    <SheetClose className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </SheetClose>
                </Link>
              ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="text-md font-bold ">
            {pathname === '/search' ? "Поиск по документам" : 'Список чатов'}
          </div>
          </header>
          
          <main className="h-full">
           {children}
        </main>
      </div>
    </div>
  )
};
