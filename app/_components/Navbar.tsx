import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <header className={cn(
      "w-full bg-background/60 text-foreground",
      "sticky top-4 z-50 backdrop-blur-sm"
    )}>
      <nav className="container max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-between py-6">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-xl font-bold hover:text-primary transition-colors"
              aria-label="Go to homepage"
            >
              NeuraMail
            </Link>
            <div className="hidden md:flex space-x-6 text-sm font-medium">
              <Link href="/products" className="hover:text-muted-foreground transition-colors">Products</Link>
              <Link href="/solutions" className="hover:text-muted-foreground transition-colors">Solutions</Link>
              <Link href="/blog" className="hover:text-muted-foreground transition-colors">Blog</Link>
              <Link href="/company" className="hover:text-muted-foreground transition-colors">Company</Link>
            </div>
          </div>

          {/* Auth & CTA */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/signIn">Sign in</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;