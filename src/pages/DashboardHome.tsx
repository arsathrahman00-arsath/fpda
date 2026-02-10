import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  MapPin, Tag, Ruler, Package, Truck, BookOpen, UtensilsCrossed,
  Calendar, ListChecks, PackageCheck, Flame, Utensils, Send, SprayCan, Eye,
  ArrowRight 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const quickActions = [
  { title: "Day Req", icon: ListChecks, to: "/dashboard/day-requirements", color: "text-primary", bgColor: "bg-primary/10" },
  { title: "Schedule", icon: Calendar, to: "/dashboard/schedule", color: "text-accent-foreground", bgColor: "bg-accent" },
  { title: "Packing", icon: PackageCheck, to: "/dashboard/packing", color: "text-secondary-foreground", bgColor: "bg-secondary" },
  { title: "Cooking", icon: Flame, to: "/dashboard/cooking", color: "text-destructive", bgColor: "bg-destructive/10" },
];

const dashboardCards = [
  { title: "Location", description: "Manage locations", icon: MapPin, to: "/dashboard/location", color: "text-primary", bgColor: "bg-primary/10" },
  { title: "Item Category", description: "Organize categories", icon: Tag, to: "/dashboard/item-category", color: "text-accent-foreground", bgColor: "bg-accent" },
  { title: "Unit", description: "Measurement units", icon: Ruler, to: "/dashboard/unit", color: "text-secondary-foreground", bgColor: "bg-secondary" },
  { title: "Item", description: "Inventory items", icon: Package, to: "/dashboard/item", color: "text-warning-foreground", bgColor: "bg-warning/10" },
  { title: "Supplier", description: "Supplier info", icon: Truck, to: "/dashboard/supplier", color: "text-destructive", bgColor: "bg-destructive/10" },
  { title: "Recipe Type", description: "Categorize recipes", icon: BookOpen, to: "/dashboard/recipe-type", color: "text-primary", bgColor: "bg-primary/10" },
  { title: "Recipe", description: "Manage recipes", icon: UtensilsCrossed, to: "/dashboard/recipe", color: "text-accent-foreground", bgColor: "bg-accent" },
];

const workflowCards = [
  { title: "Allocation", description: "Food allocation", icon: Utensils, to: "/dashboard/food-allocation", color: "text-primary", bgColor: "bg-primary/10" },
  { title: "Delivery", description: "Dispatch orders", icon: Send, to: "/dashboard/delivery", color: "text-accent-foreground", bgColor: "bg-accent" },
  { title: "Cleaning", description: "Cleaning tasks", icon: SprayCan, to: "/dashboard/cleaning/material", color: "text-secondary-foreground", bgColor: "bg-secondary" },
  { title: "Media", description: "View uploads", icon: Eye, to: "/dashboard/view-media", color: "text-muted-foreground", bgColor: "bg-muted" },
];

const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-foreground">
          Hi, <span className="text-gradient-warm">{user?.user_name}</span> 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your food operations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="stat-card p-3">
          <div className="text-center">
            <p className="text-2xl md:text-4xl font-bold text-gradient-warm">7</p>
            <p className="text-[10px] md:text-sm text-muted-foreground mt-0.5">Sections</p>
          </div>
        </Card>
        <Card className="stat-card p-3">
          <div className="text-center">
            <p className="text-lg md:text-4xl font-bold text-foreground capitalize truncate">{user?.role_selection}</p>
            <p className="text-[10px] md:text-sm text-muted-foreground mt-0.5">Role</p>
          </div>
        </Card>
        <Card className="stat-card p-3">
          <div className="text-center">
            <p className="text-lg md:text-4xl font-bold text-foreground truncate">{user?.user_code}</p>
            <p className="text-[10px] md:text-sm text-muted-foreground mt-0.5">Code</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((item) => (
            <Link key={item.to} to={item.to}>
              <Card className="stat-card p-3 text-center group">
                <div className={`w-10 h-10 mx-auto rounded-xl ${item.bgColor} flex items-center justify-center mb-1.5`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <p className="text-xs font-medium truncate">{item.title}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Master Data */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Master Data</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {dashboardCards.map((card) => (
            <Link key={card.to} to={card.to}>
              <Card className="stat-card group h-full">
                <CardHeader className="p-3 pb-1">
                  <div className={`w-9 h-9 rounded-lg ${card.bgColor} flex items-center justify-center mb-2`}>
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                  <CardTitle className="text-sm flex items-center justify-between">
                    {card.title}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                  <CardDescription className="text-xs">{card.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Workflow */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Workflow</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {workflowCards.map((card) => (
            <Link key={card.to} to={card.to}>
              <Card className="stat-card group h-full">
                <CardHeader className="p-3 pb-1">
                  <div className={`w-9 h-9 rounded-lg ${card.bgColor} flex items-center justify-center mb-2`}>
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                  <CardTitle className="text-sm">{card.title}</CardTitle>
                  <CardDescription className="text-xs">{card.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
