import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ScanLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface QrScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ open, onClose, onScan }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const startScanner = async () => {
      setError(null);
      try {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onScan(decodedText);
            scanner.stop().catch(() => {});
            onClose();
          },
          () => {} // ignore scan failures
        );
      } catch (err) {
        setError("Unable to access camera. Please grant camera permission.");
      }
    };

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(startScanner, 300);

    return () => {
      clearTimeout(timeout);
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [open, onScan, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-md p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="w-5 h-5" />
            Scan QR Code
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div
            id="qr-reader"
            className="w-full rounded-lg overflow-hidden"
            style={{ minHeight: 280 }}
          />
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <Button variant="outline" onClick={onClose} className="w-full gap-2">
            <X className="w-4 h-4" /> Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrScanner;
