"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  ImagePlus,
  Images,
  Download,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

const PLATFORM_OPTIONS = ["Android", "iOS", "WebApp", "Website", "Windows", "Mac", "Linux", "Library/Tool"];
const CATEGORY_OPTIONS = [
  "Business",
  "Finance",
  "Communication",
  "Education",
  "Entertainment",
  "Foods & Drinks",
  "Games",
  "Health & Fitness",
  "Maps & Navigation",
  "Music",
  "News",
  "Photography",
  "Productivity",
  "Social",
  "Sports",
  "Travel & Local",
  "Weather",
];
const MAX_SCREENSHOTS = 6;

export function AppForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(initialData?.iconUrl ?? null);

  // Screenshots already saved on the app (kept unless the user removes them).
  const [existingScreenshots, setExistingScreenshots] = useState<string[]>(initialData?.screenshots ?? []);
  // Newly selected files, not yet uploaded.
  const [newScreenshots, setNewScreenshots] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const totalScreenshots = existingScreenshots.length + newScreenshots.length;

  // Build/revoke object URLs for the newly selected screenshot files.
  useEffect(() => {
    const urls = newScreenshots.map((file) => URL.createObjectURL(file));
    setNewPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [newScreenshots]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, any> = Object.fromEntries(formData.entries());
    data.platforms = formData.getAll("platforms");
    data.categories = formData.getAll("categories");
    if (initialData?.iconUrl) {
      data.iconUrl = initialData.iconUrl;
    }

    try {
      const media = new FormData();
      if (iconFile) media.append("icon", iconFile);
      newScreenshots.forEach((file) => media.append("screenshots", file));
      media.append("slug", String(data.slug || initialData?.slug || "app"));
      const deletedScreenshots = (initialData?.screenshots ?? []).filter(
        (url: string) => !existingScreenshots.includes(url)
      );

      if (iconFile && initialData?.iconUrl) {
        media.append("deleteUrls", initialData.iconUrl);
      }

      deletedScreenshots.forEach((url: string) => media.append("deleteUrls", url));

      if (iconFile || newScreenshots.length || deletedScreenshots.length) {
        const uploadRes = await fetch("/api/uploads", { method: "POST", body: media });
        if (!uploadRes.ok) throw new Error(await uploadRes.text());
        const uploaded = await uploadRes.json();
        if (uploaded.iconUrl) data.iconUrl = uploaded.iconUrl;
        if (uploaded.screenshotUrls?.length) {
          data.screenshots = [...existingScreenshots, ...uploaded.screenshotUrls].join("\n");
        } else {
          data.screenshots = existingScreenshots.join("\n");
        }
      } else {
        data.screenshots = existingScreenshots.join("\n");
      }

      delete data.iconFile;
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
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const room = MAX_SCREENSHOTS - totalScreenshots;
    if (room <= 0) {
      alert(`You can only add up to ${MAX_SCREENSHOTS} screenshots per app.`);
      e.target.value = "";
      return;
    }

    if (files.length > room) {
      alert(`You can add ${room} more screenshot${room === 1 ? "" : "s"}. Only the first ${room} were added.`);
    }

    setNewScreenshots((prev) => [...prev, ...files.slice(0, room)]);
    e.target.value = ""; // allow re-selecting the same file later
  }

  function removeExistingScreenshot(index: number) {
    setExistingScreenshots((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNewScreenshot(index: number) {
    setNewScreenshots((prev) => prev.filter((_, i) => i !== index));
  }

  function handleIconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setIconFile(file);
    setIconPreview(file ? URL.createObjectURL(file) : initialData?.iconUrl ?? null);
  }

  async function deleteApp() {
    if (!initialData) return;
    setDeleting(true);

    try {
      const urls = [initialData.iconUrl, ...(initialData.screenshots ?? [])].filter(Boolean);
      if (urls.length) {
        const uploadRes = await fetch("/api/uploads", {
          method: "DELETE",
          body: JSON.stringify({ urls }),
          headers: { "Content-Type": "application/json" },
        });
        if (!uploadRes.ok) throw new Error(await uploadRes.text());
      }

      const res = await fetch(`/api/apps/${initialData.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const selectClass =
    "flex h-10 w-full appearance-none rounded-md border border-zinc-300 bg-white pl-9 pr-3 py-2 text-sm text-zinc-900 ring-offset-white transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:ring-offset-zinc-950 dark:focus:ring-zinc-100";

  const inputWrapClass = "relative";
  const inputIconClass =
    "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500";
  const inputWithIconClass = "pl-9";

  const sectionHeadingClass =
    "text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400";

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-2xl rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-200 px-6 py-5 dark:border-zinc-800 sm:px-8">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
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

      <div className="space-y-8 px-6 py-6 sm:px-8">
        {/* Section: Basics */}
        <div className="space-y-4">
          <h3 className={sectionHeadingClass}>Basics</h3>

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
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800" />

        {/* Section: Classification */}
        <div className="space-y-4">
          <h3 className={sectionHeadingClass}>Classification</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                Platforms
              </Label>
              <div className="grid grid-cols-2 gap-2 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
                {PLATFORM_OPTIONS.map((platform) => (
                  <label key={platform} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      name="platforms"
                      value={platform}
                      defaultChecked={initialData?.platforms?.includes(platform)}
                      className="size-4 rounded border-zinc-300"
                    />
                    {platform}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-4">
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
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tags className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              Categories
            </Label>
            <div className="grid grid-cols-2 gap-2 rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
              {CATEGORY_OPTIONS.map((category) => (
                <label key={category} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    name="categories"
                    value={category}
                    defaultChecked={initialData?.categories?.includes(category)}
                    className="size-4 rounded border-zinc-300"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Separate tech stack items with a comma.</p>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800" />

        {/* Section: Links */}
        <div className="space-y-4">
          <h3 className={sectionHeadingClass}>Links</h3>
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
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800" />

        {/* Section: Media */}
        <div className="space-y-4">
          <h3 className={sectionHeadingClass}>Media</h3>

          <div className="space-y-4 rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
            {/* Icon */}
            <div className="space-y-2">
              <Label htmlFor="iconFile" className="flex items-center gap-2">
                <ImagePlus className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                App icon
              </Label>
              <div className="flex items-center gap-3">
                {iconPreview ? (
                  iconPreview.startsWith("http") ? (
                    <Image
                      src={iconPreview}
                      alt="Icon preview"
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-md border border-zinc-200 object-cover dark:border-zinc-700"
                    />
                  ) : (
                    <img
                      src={iconPreview}
                      alt="Icon preview"
                      className="h-12 w-12 rounded-md border border-zinc-200 object-cover dark:border-zinc-700"
                    />
                  )
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
                    <ImagePlus className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
                  </div>
                )}
                <Input
                  id="iconFile"
                  name="iconFile"
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="flex-1 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-zinc-700 dark:file:bg-zinc-100 dark:file:text-zinc-900 dark:hover:file:bg-zinc-300"
                />
              </div>
            </div>

            {/* Screenshots */}
            <div className="space-y-3 border-t border-dashed border-zinc-300 pt-4 dark:border-zinc-700">
              <div className="flex items-center justify-between">
                <Label htmlFor="screenshotFiles" className="flex items-center gap-2">
                  <Images className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  Screenshots
                </Label>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {totalScreenshots} / {MAX_SCREENSHOTS}
                </span>
              </div>

              {totalScreenshots > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {existingScreenshots.map((url, i) => (
                    <div key={`existing-${i}`} className="group relative aspect-video overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700">
                      <Image src={url} alt={`Screenshot ${i + 1}`} fill sizes="25vw" className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingScreenshot(i)}
                        aria-label="Remove screenshot"
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {newPreviews.map((url, i) => (
                    <div key={`new-${i}`} className="group relative aspect-video overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700">
                      <img src={url} alt={`New screenshot ${i + 1}`} className="h-full w-full object-cover" />
                      <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        New
                      </span>
                      <button
                        type="button"
                        onClick={() => removeNewScreenshot(i)}
                        aria-label="Remove screenshot"
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Input
                id="screenshotFiles"
                name="screenshotFiles"
                type="file"
                accept="image/*"
                multiple
                disabled={totalScreenshots >= MAX_SCREENSHOTS}
                onChange={handleShotsChange}
                className="file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:file:bg-zinc-100 dark:file:text-zinc-900 dark:hover:file:bg-zinc-300"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Up to {MAX_SCREENSHOTS} screenshots. Hover a thumbnail to remove it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-zinc-200 px-6 py-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Button
          type="submit"
          disabled={loading || deleting}
          className="w-full gap-2 bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 sm:w-auto"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Saving..." : "Save app"}
        </Button>
        {initialData && (
          <Button
            type="button"
            variant="destructive"
            disabled={loading || deleting}
            onClick={() => setConfirmDelete(true)}
            className="w-full gap-2 sm:w-auto"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Delete app?</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              This will permanently delete {initialData.name} and remove its icon and screenshots from storage.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={deleting}
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={deleting}
                onClick={deleteApp}
                className="gap-2"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
