import Link from "next/link";
import { ReactNode } from "react";

interface AuthFooterProps {
  text: string;
  links: {
    text: string;
    href: string;
    className?: string;
  }[];
  divider?: string;
}

export default function AuthFooter({ text, links, divider = "or" }: AuthFooterProps) {
  return (
    <>
      <p className="text-sm text-gray-500 leading-none">{text}</p>
      <div className="flex items-center gap-1">
        {links.map((link, index) => (
          <>
            <Link
              key={index}
              href={link.href}
              className={`text-sm no-underline hover:underline ${link.className || "text-primary"}`}
            >
              {link.text}
            </Link>
            {index < links.length - 1 && (
              <>
                <p className="text-sm">{divider}</p>
              </>
            )}
          </>
        ))}
      </div>
    </>
  );
} 