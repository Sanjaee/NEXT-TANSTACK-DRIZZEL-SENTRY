import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/features/auth/actions";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/dashboard" className="text-foreground transition-colors hover:text-foreground font-bold">
          ACME Dashboard
        </Link>
        <Link href="/products" className="text-muted-foreground transition-colors hover:text-foreground">
          Products
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-4">
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-8 w-8 rounded-full outline-none hover:opacity-80">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? ""} />
                <AvatarFallback>{session.user.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/dashboard/profile" className="w-full cursor-pointer px-2 py-1.5" />}>
                Profile
              </DropdownMenuItem>
              <form action={logoutAction} className="w-full cursor-pointer">
                <DropdownMenuItem render={<button type="submit" className="w-full text-left px-2 py-1.5" />}>
                    Log out
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login" className={buttonVariants({ variant: "default" })}>Log in</Link>
        )}
      </div>
    </header>
  );
}
