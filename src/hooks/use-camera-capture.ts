import { Camera, CameraResultType, CameraSource, CameraDirection } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { useToast } from "@/hooks/use-toast";

export function useCameraCapture() {
  const { toast } = useToast();

  const capturePhoto = async (): Promise<File | null> => {
    try {
      // On native, use Capacitor Camera plugin
      if (Capacitor.isNativePlatform()) {
        const image = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          direction: CameraDirection.Rear,
        });

        if (image.webPath) {
          const response = await fetch(image.webPath);
          const blob = await response.blob();
          const file = new File([blob], `photo_${Date.now()}.${image.format || "jpeg"}`, {
            type: `image/${image.format || "jpeg"}`,
          });
          return file;
        }
        return null;
      }

      // On web, use getUserMedia for camera access
      return await captureFromWebCamera("photo");
    } catch (error: any) {
      if (error?.message?.includes("User cancelled")) return null;
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
      return null;
    }
  };

  const captureVideo = async (): Promise<File | null> => {
    try {
      if (Capacitor.isNativePlatform()) {
        // On native, use file picker with camera source for video
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "video/*";
        input.capture = "environment";
        
        return new Promise((resolve) => {
          input.onchange = () => {
            const file = input.files?.[0] || null;
            if (file && file.size > 50 * 1024 * 1024) {
              toast({
                title: "File too large",
                description: "Video must be under 50MB.",
                variant: "destructive",
              });
              resolve(null);
            } else {
              resolve(file);
            }
          };
          input.click();
        });
      }

      // On web, use file input fallback for video
      return await pickFileFromInput("video/*", 50);
    } catch (error: any) {
      if (error?.message?.includes("User cancelled")) return null;
      toast({
        title: "Camera Error",
        description: "Could not record video. Please check permissions.",
        variant: "destructive",
      });
      return null;
    }
  };

  const captureFromWebCamera = async (type: "photo"): Promise<File | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      return new Promise((resolve) => {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;

        // Create a fullscreen overlay for the camera
        const overlay = document.createElement("div");
        overlay.style.cssText =
          "position:fixed;inset:0;z-index:99999;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;";

        const captureBtn = document.createElement("button");
        captureBtn.textContent = "📸 Take Photo";
        captureBtn.style.cssText =
          "position:absolute;bottom:40px;padding:16px 32px;background:#fff;color:#000;border:none;border-radius:50px;font-size:18px;font-weight:bold;cursor:pointer;z-index:100000;";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "✕ Cancel";
        cancelBtn.style.cssText =
          "position:absolute;top:20px;right:20px;padding:8px 16px;background:rgba(255,255,255,0.2);color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;z-index:100000;";

        video.style.cssText = "max-width:100%;max-height:100%;object-fit:contain;";

        overlay.appendChild(video);
        overlay.appendChild(captureBtn);
        overlay.appendChild(cancelBtn);
        document.body.appendChild(overlay);

        const cleanup = () => {
          stream.getTracks().forEach((t) => t.stop());
          overlay.remove();
        };

        cancelBtn.onclick = () => {
          cleanup();
          resolve(null);
        };

        captureBtn.onclick = () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext("2d")?.drawImage(video, 0, 0);
          canvas.toBlob(
            (blob) => {
              cleanup();
              if (blob) {
                resolve(new File([blob], `photo_${Date.now()}.jpeg`, { type: "image/jpeg" }));
              } else {
                resolve(null);
              }
            },
            "image/jpeg",
            0.85
          );
        };
      });
    } catch {
      // Fallback to file input if getUserMedia fails
      return pickFileFromInput("image/*", 10);
    }
  };

  const pickFileFromInput = (accept: string, maxMB: number): Promise<File | null> => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;
      input.onchange = () => {
        const file = input.files?.[0] || null;
        if (file && file.size > maxMB * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `File must be under ${maxMB}MB.`,
            variant: "destructive",
          });
          resolve(null);
        } else {
          resolve(file);
        }
      };
      input.click();
    });
  };

  return { capturePhoto, captureVideo };
}
