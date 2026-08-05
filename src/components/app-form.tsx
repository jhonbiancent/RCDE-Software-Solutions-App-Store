"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AppWindow,
  Link2,
  LayoutGrid,
  CircleDot,
  Hash,
  Tags,
  AlignLeft,
  Images,
  Download,
  Loader2,
} from "lucide-react";

export function AppForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shotCount, setShotCount] = useState<number>(0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const media = new FormData();
      const existingScreenshots = initialData?.screenshots?.length ?? 0;
      const screenshots = formData.getAll("screenshotFiles").filter((file) => file instanceof File && file.size);

      if (existingScreenshots + screenshots.length > 6) {
        alert("You can add up to 6 screenshots per app.");
        return;
      }

      screenshots.forEach((file) => {
        if (file instanceof File && file.size) media.append("screenshots", file);
      });

      if ([...media.entries()].length) {
        const uploadRes = await fetch("/api/uploads", { method: "POST", body: media });
        if (!uploadRes.ok) throw new Error("Upload failed");
        const uploaded = await uploadRes.json();
        if (uploaded.screenshotUrls?.length) {
          data.screenshots = [
            ...(initialData?.screenshots ?? []),
            ...uploaded.screenshotUrls,
          ].join("\n");
        }
      }

      delete data.screenshotFiles;

      const res = await fetch(initialData ? `/api/apps/${initialData.id}` : "/api/apps", {
        method: initialData ? "PATCH" : "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleShotsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const count = e.target.files?.length ?? 0;
    const existingScreenshots = initialData?.screenshots?.length ?? 0;

    if (existingScreenshots + count > 6) {
      alert(`You can add ${Math.max(0, 6 - existingScreenshots)} more screenshot(s).`);
      e.target.value = "";
      setShotCount(0);
      return;
    }

    setShotCount(count);
  }

  const selectClass =
    "flex h-10 w-full appearance-none rounded-md border border-zinc-300 bg-white pl-9 pr-3 py-2 text-sm text-zinc-900 ring-offset-white transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:ring-offset-zinc-950 dark:focus:ring-zinc-100";

  const inputWrapClass = "relative";
  const inputIconClass =
    "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500";
  const inputWithIconClass = "pl-9";

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-2xl space-y-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
          <AppWindow className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {initialData ? "Edit app" : "Add a new app"}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Fill in the details below to {initialData ? "update" : "publish"} your listing.
          </p>
        </div>
      </div>

      {/* Name + Slug */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">App name</Label>
          <div className={inputWrapClass}>
            <AppWindow className={inputIconClass} />
            <Input
              id="name"
              name="name"
              defaultValue={initialData?.name}
              required
              placeholder="Acme Notes"
              className={inputWithIconClass}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <div className={inputWrapClass}>
            <Hash className={inputIconClass} />
            <Input
              id="slug"
              name="slug"
              defaultValue={initialData?.slug}
              required
              placeholder="acme-notes"
              className={inputWithIconClass}
            />
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <div className={inputWrapClass}>
          <Tags className={inputIconClass} />
          <Input
            id="tagline"
            name="tagline"
            defaultValue={initialData?.tagline}
            placeholder="A short, catchy one-liner"
            className={inputWithIconClass}
          />
        </div>
      </div>

      {/* Description with visible icon */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <div className="relative">
          <AlignLeft className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <Textarea
            id="description"
            name="description"
            defaultValue={initialData?.description}
            required
            rows={5}
            placeholder="What does this app do? Who is it for?"
            className="pl-9 pt-3"
          />
        </div>
      </div>

      {/* Category + Status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <div className={inputWrapClass}>
            <LayoutGrid className={inputIconClass} />
            <select
              id="category"
              name="category"
              defaultValue={initialData?.category || "WEB_APP"}
              className={selectClass}
            >
              <option value="WEB_APP">Web app</option>
              <option value="DESKTOP_APP">Desktop app</option>
              <option value="WEBSITE">Website</option>
              <option value="MOBILE_APP">Mobile app</option>
              <option value="LIBRARY_TOOL">Library / tool</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <div className={inputWrapClass}>
            <CircleDot className={inputIconClass} />
            <select
              id="status"
              name="status"
              defaultValue={initialData?.status || "DRAFT"}
              className={selectClass}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tech stack */}
      <div className="space-y-2">
        <Label htmlFor="techStack">Tech stack</Label>
        <div className={inputWrapClass}>
          <Tags className={inputIconClass} />
          <Input
            id="techStack"
            name="techStack"
            defaultValue={initialData?.techStack?.join(", ")}
            placeholder="Next.js, Tailwind, Prisma"
            className={inputWithIconClass}
          />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Separate each item with a comma.</p>
      </div>

      {/* URLs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="liveUrl">Live URL</Label>
          <div className={inputWrapClass}>
            <Link2 className={inputIconClass} />
            <Input
              id="liveUrl"
              name="liveUrl"
              defaultValue={initialData?.liveUrl}
              placeholder="https://..."
              className={inputWithIconClass}
            />
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">For websites and web apps.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="downloadUrl">Download URL</Label>
          <div className={inputWrapClass}>
            <Download className={inputIconClass} />
            <Input
              id="downloadUrl"
              name="downloadUrl"
              defaultValue={initialData?.downloadUrl}
              placeholder="https://..."
              className={inputWithIconClass}
            />
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">For mobile or desktop apps.</p>
        </div>
      </div>

      {/* Media uploads */}
      <div className="space-y-4 rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
        <div className="space-y-2">
          <Label htmlFor="screenshotFiles" className="flex items-center gap-2">
            <Images className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            Screenshots
          </Label>
          <Input
            id="screenshotFiles"
            name="screenshotFiles"
            type="file"
            accept="image/*"
            multiple
            onChange={handleShotsChange}
            className="file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-zinc-700 dark:file:bg-zinc-100 dark:file:text-zinc-900 dark:hover:file:bg-zinc-300"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Upload up to 6 screenshots total. {initialData?.screenshots?.length ?? 0} currently saved.
          </p>
          {shotCount > 0 && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {shotCount} new screenshot{shotCount > 1 ? "s" : ""} selected
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full gap-2 bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 sm:w-auto"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Saving..." : "Save app"}
      </Button>
    </form>
  );
}
