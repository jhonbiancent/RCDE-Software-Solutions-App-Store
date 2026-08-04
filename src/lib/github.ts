// src/lib/github.ts
import { Release, ReleaseAsset } from "@/types";

const GITHUB_API = "https://api.github.com";

export async function fetchLatestRelease(owner: string, repo: string): Promise<Release | null> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/releases/latest`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    next: { revalidate: 300 }, // ISR-style cache, 5 min — avoids hammering GitHub's rate limit
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchAllReleases(owner: string, repo: string): Promise<Release[]> {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/releases`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  return res.json();
}

export function totalDownloadCount(release: Release): number {
  return release.assets.reduce((sum, asset) => sum + asset.download_count, 0);
}
