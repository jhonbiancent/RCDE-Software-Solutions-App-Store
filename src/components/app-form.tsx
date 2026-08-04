"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AppForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
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

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">App Name</Label>
          <Input id="name" name="name" defaultValue={initialData?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={initialData?.slug} required />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" name="tagline" defaultValue={initialData?.tagline} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={initialData?.description} required rows={5} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select 
            id="category" 
            name="category" 
            defaultValue={initialData?.category || "WEB_APP"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="WEB_APP">Web App</option>
            <option value="DESKTOP_APP">Desktop App</option>
            <option value="WEBSITE">Website</option>
            <option value="MOBILE_APP">Mobile App</option>
            <option value="LIBRARY_TOOL">Library / Tool</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select 
            id="status" 
            name="status" 
            defaultValue={initialData?.status || "DRAFT"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="techStack">Tech Stack (comma separated)</Label>
        <Input id="techStack" name="techStack" defaultValue={initialData?.techStack?.join(", ")} placeholder="Next.js, Tailwind, Prisma" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="githubOwner">GitHub Owner</Label>
          <Input id="githubOwner" name="githubOwner" defaultValue={initialData?.githubOwner} placeholder="e.g. facebook" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="githubRepo">GitHub Repo</Label>
          <Input id="githubRepo" name="githubRepo" defaultValue={initialData?.githubRepo} placeholder="e.g. react" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="liveUrl">Live URL</Label>
        <Input id="liveUrl" name="liveUrl" defaultValue={initialData?.liveUrl} placeholder="https://..." />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save App"}
      </Button>
    </form>
  );
}
