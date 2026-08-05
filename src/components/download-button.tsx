import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  liveUrl?: string | null;
  downloadUrl?: string | null;
}

export function DownloadButton({ liveUrl, downloadUrl }: DownloadButtonProps) {
  if (!liveUrl && !downloadUrl) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {liveUrl && (
        <Button href={liveUrl} target="_blank" rel="noreferrer" size="lg">
          Visit Website
        </Button>
      )}
      {downloadUrl && (
        <Button href={downloadUrl} target="_blank" rel="noreferrer" size="lg" variant="secondary">
          Download App
        </Button>
      )}
    </div>
  );
}
