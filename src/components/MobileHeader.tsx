import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChefHat, ArrowLeft, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/location": "Location",
  "/dashboard/item-category": "Item Category",
  "/dashboard/unit": "Unit",
  "/dashboard/item": "Item",
  "/dashboard/supplier": "Supplier",
  "/dashboard/recipe-type": "Recipe Type",
  "/dashboard/recipe": "Recipe",
  "/dashboard/schedule": "Schedule",
  "/dashboard/requirement": "Requirement",
  "/dashboard/day-requirements": "Day Requirements",
  "/dashboard/material-receipt": "Material Receipt",
  "/dashboard/packing": "Packing",
  "/dashboard/cooking": "Cooking",
  "/dashboard/food-allocation": "Food Allocation",
  "/dashboard/delivery": "Delivery",
  "/dashboard/cleaning/material": "Material Cleaning",
  "/dashboard/cleaning/vessel": "Vessel Cleaning",
  "/dashboard/cleaning/prep": "Prep Cleaning",
  "/dashboard/cleaning/pack": "Pack Cleaning",
  "/dashboard/view-media": "View Media",
};

const MobileHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const title = routeTitles[location.pathname] || "FPDA";
  const isHome = location.pathname === "/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border md:hidden safe-area-top">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          {!isHome && (
            <Button variant="ghost" size="icon" className="h-9 w-9 -ml-1" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          {isHome && (
            <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
          <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-sm font-medium truncate">{user?.user_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role_selection}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default MobileHeader;
