import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  Calendar,
  ChefHat,
  PackageCheck,
  Flame,
  SprayCan,
  Utensils,
  Eye,
  MoreHorizontal,
  X,
  MapPin,
  Tag,
  Ruler,
  Package,
  Truck,
  BookOpen,
  UtensilsCrossed,
  CalendarDays,
  ClipboardList,
  ListChecks,
  Send,
  Droplets,
  Container,
  Sandwich,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface NavItemData {
  to: string;
  icon: React.ElementType;
  label: string;
}

const primaryTabs: NavItemData[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/dashboard/schedule", icon: Calendar, label: "Plan" },
  { to: "/dashboard/day-requirements", icon: ListChecks, label: "Prep" },
  { to: "/dashboard/packing", icon: PackageCheck, label: "Pack" },
];

const moreMenuSections = [
  {
    title: "Master Data",
    items: [
      { to: "/dashboard/location", icon: MapPin, label: "Location" },
      { to: "/dashboard/item-category", icon: Tag, label: "Item Category" },
      { to: "/dashboard/unit", icon: Ruler, label: "Unit" },
      { to: "/dashboard/item", icon: Package, label: "Item" },
      { to: "/dashboard/supplier", icon: Truck, label: "Supplier" },
      { to: "/dashboard/recipe-type", icon: BookOpen, label: "Recipe Type" },
      { to: "/dashboard/recipe", icon: UtensilsCrossed, label: "Recipe" },
    ],
  },
  {
    title: "Delivery Plan",
    items: [
      { to: "/dashboard/schedule", icon: CalendarDays, label: "Schedule" },
      { to: "/dashboard/requirement", icon: ClipboardList, label: "Requirement" },
    ],
  },
  {
    title: "Preparation",
    items: [
      { to: "/dashboard/day-requirements", icon: ListChecks, label: "Day Requirements" },
      { to: "/dashboard/material-receipt", icon: Package, label: "Material Receipt" },
    ],
  },
  {
    title: "Production",
    items: [
      { to: "/dashboard/cooking", icon: Flame, label: "Cooking" },
      { to: "/dashboard/packing", icon: PackageCheck, label: "Packing" },
    ],
  },
  {
    title: "Distribution",
    items: [
      { to: "/dashboard/food-allocation", icon: Utensils, label: "Food Allocation" },
      { to: "/dashboard/delivery", icon: Send, label: "Delivery" },
    ],
  },
  {
    title: "Cleaning",
    items: [
      { to: "/dashboard/cleaning/material", icon: Droplets, label: "Materials" },
      { to: "/dashboard/cleaning/vessel", icon: Container, label: "Vessel" },
      { to: "/dashboard/cleaning/prep", icon: Sandwich, label: "Preparation Area" },
      { to: "/dashboard/cleaning/pack", icon: Archive, label: "Packing Area" },
    ],
  },
  {
    title: "Other",
    items: [
      { to: "/dashboard/view-media", icon: Eye, label: "View Media" },
    ],
  },
];

const MobileBottomNav: React.FC = () => {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const isMoreActive = !primaryTabs.some(t => t.to === location.pathname);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden safe-area-bottom">
        <div className="flex items-stretch justify-around h-16">
          {primaryTabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === "/dashboard"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center flex-1 gap-0.5 text-[10px] font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )
              }
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 gap-0.5 text-[10px] font-medium transition-colors",
              isMoreActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* More Menu Sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl overflow-y-auto pb-8">
          <SheetHeader className="pb-2">
            <SheetTitle className="text-lg">All Modules</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 mt-2">
            {moreMenuSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                  {section.title}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMoreOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-muted/50 text-foreground hover:bg-muted"
                        )
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileBottomNav;
