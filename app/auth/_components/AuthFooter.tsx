import Link from "next/link";
import { ReactNode } from "react";

interface AuthFooterProps {
  text: string;
  links: {
    text: string;
    href: string;
    className?: string;
    icon?: ReactNode;
  }[];
  divider?: string;
}

export default function AuthFooter({ text, links, divider = "or" }: AuthFooterProps) {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">{text}</p>
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        {links.map((link, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && divider && (
              <span className="mx-2 text-xs text-muted-foreground">{divider}</span>
            )}
            <Link
              href={link.href}
              className={`text-sm font-medium no-underline hover:underline ${link.className || "text-primary"}`}
            >
              <span className="flex items-center">
                {link.icon && <span className="mr-1">{link.icon}</span>}
                {link.text}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}