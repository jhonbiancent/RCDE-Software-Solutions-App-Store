import { Button } from "@/components/ui/button";
import { ReleaseAsset } from "@/types";

function getPlatformLabel(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes(".exe") || lower.includes("windows") || lower.includes("win")) return "Windows";
  if (lower.includes(".dmg") || lower.includes("mac") || lower.includes("osx")) return "macOS";
  if (lower.includes(".appimage") || lower.includes(".deb") || lower.includes(".rpm") || lower.includes("linux")) return "Linux";
  return name;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DownloadButtonProps {
  assets?: ReleaseAsset[];
  repoUrl?: string | null;
  liveUrl?: string | null;
  tagName?: string;
}

export function DownloadButton({ assets, repoUrl, liveUrl, tagName }: DownloadButtonProps) {
  const hasRelease = assets && assets.length > 0;
  const hasLiveUrl = !!liveUrl;

  if (!hasRelease && !hasLiveUrl) return null;

  return (
    <div className="space-y-4">
      {hasLiveUrl && (
        <Button href={liveUrl!} target="_blank" rel="noreferrer" size="lg">
          Visit App ↗
        </Button>
      )}

      {hasRelease && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Download {tagName ? `(${tagName})` : ""}
            </h3>
            {repoUrl && (
              <a href={repoUrl} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                View on GitHub ↗
              </a>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {assets!.map((asset) => (
              <a
                key={asset.browser_download_url}
                href={asset.browser_download_url}
                className="flex items-center justify-between gap-4 rounded-lg border p-3 text-sm hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium group-hover:text-primary transition-colors">
                    ↓ {getPlatformLabel(asset.name)}
                  </span>
                  <span className="text-muted-foreground text-xs">{formatBytes(asset.size)}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {asset.download_count.toLocaleString()} downloads
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
