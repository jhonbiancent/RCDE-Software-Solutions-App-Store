// src/types/index.ts
import type { App, Review, AppStatus } from "../generated/prisma/client";

export type { App, Review, AppStatus };

/** App with pre-computed average rating */
export type AppWithRating = App & {
  _count?: { reviews: number };
  averageRating?: number | null;
};

/** GitHub release asset */
export type ReleaseAsset = {
  name: string;
  browser_download_url: string;
  download_count: number;
  size: number;
  content_type: string;
};

/** GitHub release */
export type Release = {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  assets: ReleaseAsset[];
  html_url: string;
};
