"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { assertPdfFile } from "@/lib/pdf/validation";
import { cn } from "@/lib/utils";

type ImportResumeButtonProps = {
  collapsed?: boolean;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
};

export function ImportResumeButton({
  collapsed = false,
  variant = "default",
  size = "default",
  className,
}: ImportResumeButtonProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const importPdf = async (file: File) => {
    try {
      await assertPdfFile(file);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Invalid PDF file",
      );
      return;
    }

    setImporting(true);
    const toastId = toast.loading("Importing resume from PDF…");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resumes/import-pdf", {
        method: "POST",
        body: formData,
      });

      const payload = (await res.json()) as { id?: string; error?: string };

      if (!res.ok) {
        throw new Error(payload.error ?? "Import failed");
      }

      toast.dismiss(toastId);
      toast.success("Resume imported");
      router.push(`/dashboard/resume/${payload.id}`);
      router.refresh();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error instanceof Error ? error.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  if (collapsed) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={importing}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) await importPdf(file);
          }}
        />
        <Button
          type="button"
          size="icon"
          variant={variant}
          className={className}
          disabled={importing}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Import PDF"
          title="Import PDF"
        >
          {importing ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <FileUp className="size-5" />
          )}
        </Button>
      </>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        disabled={importing}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) await importPdf(file);
        }}
      />
      <Button
        type="button"
        size={size}
        variant={variant}
        className={cn(
          "w-full",
          size === "lg" && "h-9 px-4 text-sm font-medium",
          className,
        )}
        disabled={importing}
        onClick={() => fileInputRef.current?.click()}
      >
        {importing ? (
          <Loader2
            className={cn(
              "shrink-0 animate-spin",
              size === "lg" ? "size-5" : "size-4",
            )}
          />
        ) : (
          <FileUp
            className={cn("shrink-0", size === "lg" ? "size-5" : "size-4")}
          />
        )}
        Import PDF
      </Button>
    </>
  );
}
