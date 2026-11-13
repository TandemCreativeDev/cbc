"use client";

import { useEffect, useState } from "react";
import { useField, useForm } from "@payloadcms/ui";
import type { UIFieldClientComponent } from "payload";
import { compressImage } from "../../lib/payload/compressImage";

const handled = new WeakSet<File>();

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${Math.round(bytes / 1024)} KB`;

type Outcome =
  | { status: "done"; original: number; compressed: number }
  | { status: "failed" };

export const ImageCompressor: UIFieldClientComponent = () => {
  const { value: file, setValue } = useField<File | null>({ path: "file" });
  const { setProcessing } = useForm();
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  useEffect(() => {
    if (!(file instanceof File) || handled.has(file)) return;
    handled.add(file);
    setProcessing(true);
    compressImage(file)
      .then((compressed) => {
        handled.add(compressed);
        if (compressed === file) return;
        setValue(compressed);
        setOutcome({
          status: "done",
          original: file.size,
          compressed: compressed.size,
        });
      })
      .catch(() => setOutcome({ status: "failed" }))
      .finally(() => setProcessing(false));
  }, [file, setValue, setProcessing]);

  if (!outcome) return null;

  return (
    <p role="status" style={{ margin: "0 0 var(--base)" }}>
      {outcome.status === "done"
        ? `Compressed in the browser: ${formatSize(outcome.original)} to ${formatSize(outcome.compressed)}.`
        : "This browser could not compress the image, so the original will be uploaded and shrunk by the server."}
    </p>
  );
};
