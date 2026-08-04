import { NextResponse } from "next/server";
import { fetchAllReleases } from "@/lib/github";

export const revalidate = 300; // 5 min cache

export async function GET(
  req: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params;
  const releases = await fetchAllReleases(owner, repo);
  return NextResponse.json(releases);
}
