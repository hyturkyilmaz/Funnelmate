import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  Settings,
  CreditCard,
  Bot,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";
const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "AI Chat", href: "/chat", icon: MessageCircle },
  { name: "Integrations", href: "/integrations", icon: Settings },
  { name: "Billing", href: "/billing", icon: CreditCard },
];
export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  const getInitials = (name: string = "") => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };
  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 text-slate-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Bot className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-xl font-bold font-display text-white">Clarity AI</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-slate-800 hover:text-white"
              )
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full rounded-md hover:bg-slate-800 transition-colors duration-200">
            <div className="flex items-center p-2 w-full text-left">
              <Avatar className="h-9 w-9 mr-3">
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name} />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email || 'No email'}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 ml-2 flex-shrink-0" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink to="/profile" className="w-full cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/settings" className="w-full cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}