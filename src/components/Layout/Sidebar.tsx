import { 
  FileText, 
  Receipt, 
  Wrench, 
  Scissors, 
  ChefHat, 
  Package, 
  BarChart3, 
  Home,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: string;
}

export function Sidebar({ activeSection, onSectionChange, userRole }: SidebarProps) {
  const salesMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, available: true },
    { id: "quotes", label: "Quotations", icon: FileText, available: true },
    { id: "invoices", label: "Invoice Requests", icon: Receipt, available: true },
  ];

  const financeMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, available: true },
    { id: "pending-invoices", label: "Pending Invoices", icon: Receipt, available: true },
    { id: "payments", label: "Payment Status", icon: BarChart3, available: true },
  ];

  const futureModules = [
    { id: "workshop", label: "Workshop Logs", icon: Wrench, available: false },
    { id: "tailoring", label: "Tailoring Logs", icon: Scissors, available: false },
    { id: "kitchen", label: "Kitchen Logs", icon: ChefHat, available: false },
    { id: "office-supply", label: "Office Supply", icon: Building2, available: false },
    { id: "inventory", label: "Inventory", icon: Package, available: false },
    { id: "reports", label: "Reports", icon: BarChart3, available: false },
  ];

  const currentMenuItems = userRole === "Finance" ? financeMenuItems : salesMenuItems;

  return (
    <aside className="w-64 bg-nav-background text-nav-foreground h-full flex flex-col">
      <div className="p-6 border-b border-nav-accent/20">
        <h2 className="text-lg font-semibold mb-1">{userRole} Portal</h2>
        <p className="text-sm text-nav-foreground/70">Sales & Invoice Module</p>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2 mb-8">
          {currentMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                activeSection === item.id
                  ? "bg-nav-accent text-white"
                  : "hover:bg-nav-foreground/10 text-nav-foreground/90"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-nav-accent/20 pt-4">
          <h3 className="text-xs font-medium text-nav-foreground/60 uppercase tracking-wide mb-3">
            Future Modules
          </h3>
          <div className="space-y-1">
            {futureModules.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 px-3 py-2 text-nav-foreground/40 cursor-not-allowed"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
                <span className="text-xs bg-nav-foreground/20 px-2 py-0.5 rounded-full ml-auto">
                  Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}