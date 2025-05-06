"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search, Bot, Mail, FileText, Send, Terminal,
  ChevronLeft, ChevronRight, Sun, Moon,
  PenBox, LogOut, User, Settings
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Custom Components
import { PlanCard } from "./PlanCard";
import { AIAssistantCard } from "./AIAssistantCard";
import { FlipText } from "@/components/magicui/flip-text";

// Types
interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  onComposeClick?: () => void;
  onSelectEmail?: (ticket: {
    ticket_no: string;
    sender_email: string;
    Subject: string;
    request_type: string;
    Thread: Array<{
      message_id: string;
      request_description: string;
      email_body: string;
      timestamp: string;
      Reply: string | null;
    }>;
    status: string;
    createdAt: string;
    updatedAt: string;
  }) => void;
}

// Constants
const SIDEBAR_WIDTHS = {
  collapsed: "w-16",
  expanded: "w-60 md:w-64 lg:w-72 xl:w-80"
};

const NAV_ITEMS = [
  { icon: Mail, label: "Inbox", count: 0 },
  { icon: FileText, label: "Drafts", count: 0 },
  { icon: Send, label: "Sent", count: 0 }
];

export function Sidebar({ sidebarCollapsed, setSidebarCollapsed, onComposeClick, onSelectEmail }: SidebarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("login_id");
    localStorage.removeItem("remember_user");

    // Redirect to sign-in page
    router.push("/auth/sign-in");
  };

  // Handle window resize for auto-collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarCollapsed]);

  // Handle theme toggle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render navigation items
  const renderNavItems = () => (
    <div className="space-y-2">
      {NAV_ITEMS.map((item) => (
        <TooltipProvider key={item.label}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full ${sidebarCollapsed ? 'w-10 h-10 justify-center p-0' : 'w-full justify-start'} flex items-center gap-2`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="flex items-center justify-between w-full">
                    {item.label}
                    <span className="text-muted-foreground">{item.count}</span>
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
  // Render AI Assistant Dialog
  const renderAIAssistantDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={`w-full ${sidebarCollapsed ? 'w-10 h-10 p-0' : ''}`}>
          <Bot className="h-4 w-4 mx-auto" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Card>
          <CardHeader className="text-sm font-medium">Ask AI anything</CardHeader>
          <CardContent>
            <Input placeholder="Ask AI about your emails" />
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              <Button variant="outline" size="sm">What can I ask?</Button>
              <Button variant="outline" size="sm">Next meeting?</Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );

  // Render user profile section
  const renderUserProfile = () => {
    // Get user email from localStorage
    let userEmail = "";
    try {
      userEmail = localStorage.getItem("user_email") || "user@example.com";
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }

    // Get initials for avatar
    const initials = userEmail
      .split('@')[0]
      .substring(0, 2)
      .toUpperCase();

    return (
      <div className={`flex items-center gap-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className={`${sidebarCollapsed ? 'h-8 w-8' : ''} cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all`}>
              <AvatarImage src="https://github.com/shadcn.png" alt="User Profile" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Update Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer">
              {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <div
      className={`border-r p-4 flex flex-col justify-between bg-background transition-all duration-300 ${sidebarCollapsed ? SIDEBAR_WIDTHS.collapsed : SIDEBAR_WIDTHS.expanded
        }`}
    >
      <div>
        {/* Collapse Button */}
        <div className="flex justify-between items-center ">
          <FlipText className={`text-xl font-bold -tracking-widest text-black dark:text-white ${sidebarCollapsed ? `hidden` : `block`}`}>
            NEURAMAIL
          </FlipText>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <Separator className="my-4" />

        {/* Navigation Items */}
        {renderNavItems()}
      </div>

      <div className="flex flex-col gap-4">

        {/* Cards Section */}
        {!sidebarCollapsed ? (
          <>
            {/* <PlanCard /> */}
            <AIAssistantCard onSelectEmail={onSelectEmail} />
          </>
        ) : (
          <div className="flex justify-center flex-col gap-2">
            <Button onClick={onComposeClick} variant="outline" className={`w-full ${sidebarCollapsed ? 'w-10 h-10 p-0' : ''}`}>
              <PenBox className="h-4 w-4 mx-auto" />
            </Button>
            {renderAIAssistantDialog()}
          </div>
        )}

        <Separator className="" />

        {/* Footer Section */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative ${sidebarCollapsed ? 'items-center' : ''}`}>
          {renderUserProfile()}
          {!sidebarCollapsed && (
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <Button className="flex-1 min-w-[100px]" onClick={onComposeClick}>Compose</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}