"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Upload, X } from "lucide-react";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const filename = `${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(filename, file, { upsert: false });

      if (!error) {
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(filename);
        uploaded.push(data.publicUrl);
      }
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
    e.target.value = "";
  }

  function removeImage(url: string) {
    onChange(images.filter((i) => i !== url));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {images.map((url) => (
          <div key={url} className="relative w-20 h-20">
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
          <Upload className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400 mt-1">
            {uploading ? "…" : "Upload"}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}
