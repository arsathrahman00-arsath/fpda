import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { deliveryScheduleApi, recipeTypeListApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface RecipeTypeOption {
  recipe_type: string;
  recipe_code?: number;
}

interface ExistingSchedule {
  schd_date: string;
  recipe_type: string;
}

interface ScheduleRow {
  id: string;
  schd_date: Date | undefined;
  recipe_type: string;
}

interface ScheduleFormFieldsProps {
  onSuccess?: () => void;
  isModal?: boolean;
}

const createEmptyRow = (): ScheduleRow => ({
  id: crypto.randomUUID(),
  schd_date: undefined,
  recipe_type: "",
});

const ScheduleFormFields: React.FC<ScheduleFormFieldsProps> = ({
  onSuccess,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipeTypes, setRecipeTypes] = useState<RecipeTypeOption[]>([]);
  const [existingSchedules, setExistingSchedules] = useState<ExistingSchedule[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [rows, setRows] = useState<ScheduleRow[]>([createEmptyRow(), createEmptyRow(), createEmptyRow()]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipeResponse, scheduleResponse] = await Promise.all([
          recipeTypeListApi.getAll(),
          deliveryScheduleApi.getAll(),
        ]);

        if (recipeResponse.status === "success" && recipeResponse.data) {
          setRecipeTypes(recipeResponse.data.map((item: any) => ({
            recipe_type: item.recipe_type,
            recipe_code: item.recipe_code,
          })));
        }

        if (scheduleResponse.status === "success" && scheduleResponse.data) {
          setExistingSchedules(scheduleResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({ title: "Error", description: "Failed to load form data", variant: "destructive" });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [toast]);

  const addRow = () => setRows(prev => [...prev, createEmptyRow()]);
  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const updateRow = (id: string, field: keyof ScheduleRow, value: any) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Get dates used in other rows (for duplicate prevention)
  const getUsedDates = (currentRowId: string): string[] => {
    return rows
      .filter(r => r.id !== currentRowId && r.schd_date)
      .map(r => format(r.schd_date!, "yyyy-MM-dd"));
  };

  const checkDuplicate = (date: Date, recipeType: string): boolean => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return existingSchedules.some((schedule) => {
      const existingDate = schedule.schd_date.split("T")[0];
      return existingDate === formattedDate &&
        schedule.recipe_type.trim().toLowerCase() === recipeType.trim().toLowerCase();
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Error", description: "You must be logged in", variant: "destructive" });
      return;
    }

    const validRows = rows.filter(r => r.schd_date && r.recipe_type);
    if (validRows.length === 0) {
      toast({ title: "Validation Error", description: "Please fill at least one complete row", variant: "destructive" });
      return;
    }

    // Check for duplicates
    for (const row of validRows) {
      if (checkDuplicate(row.schd_date!, row.recipe_type)) {
        toast({
          title: "Duplicate Entry",
          description: `"${row.recipe_type}" is already scheduled for ${format(row.schd_date!, "PPP")}`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const results = await Promise.all(
        validRows.map(row => {
          const selectedRecipe = recipeTypes.find(r => r.recipe_type === row.recipe_type);
          const formattedDate = format(row.schd_date!, "yyyy-MM-dd'T'00:00:00");
          return deliveryScheduleApi.create({
            schd_date: formattedDate,
            recipe_type: row.recipe_type,
            recipe_code: String(selectedRecipe?.recipe_code || ""),
            created_by: user.user_name,
          });
        })
      );

      const allSuccess = results.every(r => r.status === "success" || r.status === "ok");
      if (allSuccess) {
        // Add to existing schedules for session duplicate prevention
        validRows.forEach(row => {
          setExistingSchedules(prev => [...prev, {
            schd_date: format(row.schd_date!, "yyyy-MM-dd'T'00:00:00"),
            recipe_type: row.recipe_type,
          }]);
        });
        toast({ title: "Success", description: `${validRows.length} schedule(s) created successfully` });
        setRows([createEmptyRow(), createEmptyRow(), createEmptyRow()]);
        onSuccess?.();
      } else {
        throw new Error("Some schedules failed to create");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create schedule", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading form data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-3">
        {rows.map((row, index) => {
          const usedDates = getUsedDates(row.id);
          return (
            <div key={row.id} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  {index === 0 && <Label className="text-xs">Schedule Date *</Label>}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn("w-full pl-3 text-left font-normal h-9", !row.schd_date && "text-muted-foreground")}
                      >
                        {row.schd_date ? format(row.schd_date, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={row.schd_date}
                        onSelect={(date) => updateRow(row.id, "schd_date", date)}
                        disabled={(date) => usedDates.includes(format(date, "yyyy-MM-dd"))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  {index === 0 && <Label className="text-xs">Recipe Type *</Label>}
                  <Select value={row.recipe_type} onValueChange={(v) => updateRow(row.id, "recipe_type", v)}>
                    <SelectTrigger className="h-9"><SelectValue placeholder="Select recipe" /></SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      {recipeTypes.map((recipe) => (
                        <SelectItem key={recipe.recipe_type} value={recipe.recipe_type}>{recipe.recipe_type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-1 pt-1">
                {index === rows.length - 1 && (
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={addRow}>
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
                {rows.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeRow(row.id)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Button type="submit" className="w-full bg-gradient-warm hover:opacity-90" disabled={isSubmitting}>
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</>
        ) : (
          `Create ${rows.filter(r => r.schd_date && r.recipe_type).length || ""} Schedule(s)`
        )}
      </Button>
    </form>
  );
};

export default ScheduleFormFields;
