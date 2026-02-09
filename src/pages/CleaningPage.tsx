import React, { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { CalendarIcon, Camera, Video, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cleaningApi, CleaningType } from "@/lib/api";

const CLEANING_TYPES: { key: CleaningType; label: string; description: string }[] = [
  { key: "material", label: "Materials Cleaning", description: "Log cleaning of raw materials and ingredients" },
  { key: "vessel", label: "Vessel Cleaning", description: "Log cleaning of cooking vessels and utensils" },
  { key: "prep", label: "Preparation Area Cleaning", description: "Log cleaning of food preparation areas" },
  { key: "pack", label: "Packing Area Cleaning", description: "Log cleaning of packing and packaging areas" },
];

const CleaningPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeType, setActiveType] = useState<CleaningType>("material");
  const [cleanDate, setCleanDate] = useState<Date>();
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const activeConfig = CLEANING_TYPES.find(t => t.key === activeType)!;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: "Image must be under 10MB.", variant: "destructive" });
        return;
      }
      setPhoto(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast({ title: "Invalid file", description: "Please select a video file.", variant: "destructive" });
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast({ title: "File too large", description: "Video must be under 50MB.", variant: "destructive" });
        return;
      }
      setVideo(file);
    }
  };

  const resetForm = () => {
    setCleanDate(undefined);
    setPhoto(null);
    setVideo(null);
    if (photoRef.current) photoRef.current.value = "";
    if (videoRef.current) videoRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!cleanDate) {
      toast({ title: "Missing date", description: "Please select a cleaning date.", variant: "destructive" });
      return;
    }
    if (!photo) {
      toast({ title: "Missing photo", description: "Please upload a cleaning photo.", variant: "destructive" });
      return;
    }
    if (!video) {
      toast({ title: "Missing video", description: "Please upload a cleaning video.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("clean_date", format(cleanDate, "yyyy-MM-dd"));
      formData.append("created_by", user?.user_name || "");
      formData.append("clean_photo", photo);
      formData.append("clean_video", video);

      await cleaningApi.submit(activeType, formData);

      toast({ title: "Success", description: `${activeConfig.label} record submitted successfully.` });
      resetForm();
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit cleaning record. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cleaning</h1>
        <p className="text-muted-foreground">Document cleaning activities with photo and video evidence</p>
      </div>

      {/* Cleaning Type Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CLEANING_TYPES.map((type) => (
          <button
            key={type.key}
            onClick={() => { setActiveType(type.key); resetForm(); }}
            className={cn(
              "rounded-xl p-4 text-left transition-all border",
              activeType === type.key
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card text-card-foreground border-border hover:border-primary/50"
            )}
          >
            <span className="text-sm font-semibold">{type.label}</span>
          </button>
        ))}
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{activeConfig.label}</CardTitle>
          <p className="text-sm text-muted-foreground">{activeConfig.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Cleaning Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !cleanDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {cleanDate ? format(cleanDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={cleanDate}
                  onSelect={setCleanDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Cleaning Photo *</Label>
            <div
              onClick={() => photoRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
                photo ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"
              )}
            >
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              {photo ? (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">{photo.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Camera className="w-8 h-8" />
                  <span className="text-sm">Click to upload photo</span>
                  <span className="text-xs">JPG, PNG, WebP (max 10MB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <Label>Cleaning Video *</Label>
            <div
              onClick={() => videoRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
                video ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"
              )}
            >
              <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
              {video ? (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">{video.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Video className="w-8 h-8" />
                  <span className="text-sm">Click to upload video</span>
                  <span className="text-xs">MP4, MOV, WebM (max 50MB)</span>
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Submit {activeConfig.label}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CleaningPage;
