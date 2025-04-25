import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <nav className={cn(
      "w-full bg-black/90 text-white",
      "sticky top-0 z-50 backdrop-blur-sm"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo + Nav Links */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-xl font-bold hover:text-gray-300 transition-colors"
              aria-label="Go to homepage"
            >
              Applied Labs
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/products" className="hover:text-gray-300 transition-colors">Products</Link>
              <Link href="/solutions" className="hover:text-gray-300 transition-colors">Solutions</Link>
              <Link href="/blog" className="hover:text-gray-300 transition-colors">Blog</Link>
              <Link href="/company" className="hover:text-gray-300 transition-colors">Company</Link>
            </div>
          </div>

          {/* Auth + CTA */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button variant="default" asChild>
              <Link href="/contact-sales">
                Contact sales
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;