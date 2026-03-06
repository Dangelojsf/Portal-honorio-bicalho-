"use client";

import { useId, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  defaultValue?: string;
  multiple?: boolean;
  placeholder?: string;
  required?: boolean;
}

function parseImages(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ImageUploadField({
  name,
  label,
  defaultValue = "",
  multiple = false,
  placeholder = "/images/exemplo.jpg",
  required = true
}: ImageUploadFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const images = multiple ? parseImages(value) : value ? [value] : [];

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData
    });

    const payload = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !payload.url) {
      throw new Error(payload.error || "Nao foi possivel enviar a imagem.");
    }

    return payload.url;
  }

  async function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadedUrls = await Promise.all(Array.from(files).map((file) => uploadFile(file)));
      setValue((currentValue) => {
        if (multiple) {
          const currentImages = parseImages(currentValue);
          return [...currentImages, ...uploadedUrls].join(", ");
        }

        return uploadedUrls[0];
      });
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Falha ao enviar imagem.";
      setError(message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removeImage(urlToRemove: string) {
    if (!multiple) {
      setValue("");
      return;
    }

    setValue((currentValue) => parseImages(currentValue).filter((url) => url !== urlToRemove).join(", "));
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium" htmlFor={inputId}>
        {label}
      </label>

      <div className="flex flex-col gap-3 lg:flex-row">
        <Input
          id={inputId}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          required={required}
          className="flex-1"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          multiple={multiple}
          className="hidden"
          onChange={handleFileSelection}
        />
        <Button
          type="button"
          variant="secondary"
          className="min-w-[170px]"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Enviando..." : "Upload de imagem"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Formatos: JPG, PNG, WEBP ou AVIF. Tamanho maximo: 5MB.
      </p>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {images.length ? (
        <div className={cn("grid gap-3", multiple ? "sm:grid-cols-2 xl:grid-cols-3" : "max-w-sm")}>
          {images.map((imageUrl) => (
            <div key={imageUrl} className="overflow-hidden rounded-[1.25rem] border border-border bg-white shadow-soft">
              <img src={imageUrl} alt={label} className="h-40 w-full object-cover" />
              <div className="flex items-center justify-between gap-2 p-3">
                <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{imageUrl}</p>
                <Button type="button" size="icon" variant="ghost" onClick={() => removeImage(imageUrl)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-[1.25rem] border border-dashed border-border bg-muted/50 px-4 py-6 text-sm text-muted-foreground">
          <ImagePlus className="h-5 w-5 text-primary" />
          <span>Nenhuma imagem selecionada.</span>
        </div>
      )}
    </div>
  );
}
