"use client";
import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
};

type FooterSectionProps = {
  title: string;
  children: React.ReactNode;
};

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="hover:text-secondary-foreground text-muted-foreground text-sm transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  </li>
);

const FooterSection: React.FC<FooterSectionProps> = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-bold text-primary transition-colors">{title}</h3>
    <ul className="space-y-2">
      {children}
    </ul>
  </div>
);

const Footer: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Only enable theme switching after component mounts
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  const getThemeIcon = () => {
    if (theme === "dark") return <Sun className="h-4 w-4" />;
    if (theme === "light") return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <footer className="bg-background py-4 border-t">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <FooterSection title="Products">
            <FooterLink href="#">Agents</FooterLink>
            <FooterLink href="#">Flows</FooterLink>
            <FooterLink href="#">Observability</FooterLink>
          </FooterSection>

          <FooterSection title="Solutions">
            <FooterLink href="#">Customer Support</FooterLink>
            <FooterLink href="#">Operations</FooterLink>
          </FooterSection>

          <FooterSection title="Company">
            <FooterLink href="#">About</FooterLink>
            <FooterLink href="#">Blog</FooterLink>
            <FooterLink href="#">Docs</FooterLink>
            <FooterLink href="#">Shop</FooterLink>
          </FooterSection>

          <FooterSection title="Connect">
            <FooterLink href="#">Investors</FooterLink>
            <FooterLink href="#">Press</FooterLink>
            <FooterLink href="#">LinkedIn</FooterLink>
            <FooterLink href="#">Twitter / X</FooterLink>
          </FooterSection>

          <FooterSection title="Legal">
            <FooterLink href="#">Privacy</FooterLink>
            <FooterLink href="#">Terms</FooterLink>
            <FooterLink href="#">Security</FooterLink>
            <FooterLink href="#">DPA</FooterLink>
          </FooterSection>

          <div className="flex flex-col items-start justify-between">
            <div className="flex flex-col items-end gap-2">
              <div className="">
                {mounted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-9 w-9 rounded-full flex items-center justify-center"
                  >
                    {getThemeIcon()}
                  </Button>
                )}
              </div>
              <Badge variant={"outline"} className="rounded-full border-border">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                Beta Join
              </Badge>
              <span className="text-sm text-muted-foreground ">© Sentinal Mails 2025</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;