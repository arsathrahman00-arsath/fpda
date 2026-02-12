import { useToast } from "@/hooks/use-toast";

export function useCameraCapture() {
  const { toast } = useToast();

  const capturePhoto = async (): Promise<File | null> => {
    // Use file input with capture attribute — works in WebView and mobile browsers
    return pickFileFromInput("image/*", 10, true);
  };

  const captureVideo = async (): Promise<File | null> => {
    return pickFileFromInput("video/*", 50, true);
  };

  const pickFileFromInput = (accept: string, maxMB: number, useCapture: boolean): Promise<File | null> => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;
      if (useCapture) {
        input.capture = "environment";
      }

      const handleFocus = () => {
        // Timeout to detect if user cancelled the picker
        setTimeout(() => {
          if (!input.files || input.files.length === 0) {
            resolve(null);
          }
          window.removeEventListener("focus", handleFocus);
        }, 500);
      };
      window.addEventListener("focus", handleFocus);

      input.onchange = () => {
        window.removeEventListener("focus", handleFocus);
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
