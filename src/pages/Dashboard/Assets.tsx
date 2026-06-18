import { memo, useState, useEffect, useRef } from "react";
import { dashboardStyles as styles } from "./Dashboard.styles";
import EmptySpace from "./EmptySpace";
import { images } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { FullscreenPreview } from "@/components/shared/FullscreenPreview";
import { CloudUpload, Copy, Fullscreen } from "lucide-react";
import { mockAssets } from "@/data/asset";
import type { AssetSummary } from "@/types";
import Control from "./Control";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { cn } from "@/lib/utils";

export default function Assets() {
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);

  const handleFullscreen = (url: string) => {
    setFullscreenUrl(url);
  };

  const handleCloseFullscreen = () => {
    setFullscreenUrl(null);
  };

  return mockAssets.length === 0 ? (
    <EmptySpace
      icon={images.emptyAssets}
      title="Your asset library is empty"
      content="Upload images to use them seamlessly in your projects."
      button={
        <Button className={styles.emptyButton}>
          <CloudUpload strokeWidth={3} />
          Upload your assets
        </Button>
      }
    />
  ) : (
    <div className={styles.contentContainer}>
      <div className="py-[20px] md:py-[40px]">
        <Control
          tabname="Assets"
          button={
            <Button className={cn(styles.emptyButton, "w-full")}>
              <CloudUpload strokeWidth={3} />
              Upload your assets
            </Button>
          }
        />
      </div>
      <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-5">
        {mockAssets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} onFullscreen={handleFullscreen} />
        ))}
        <FullscreenPreview src={fullscreenUrl} onClose={handleCloseFullscreen} />
      </div>
    </div>
  );
}

interface AssetCardProps {
  asset: AssetSummary;
  onFullscreen: (url: string) => void;
}

const AssetCard = memo(function AssetCard({ asset, onFullscreen }: AssetCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [copy, setCopy] = useState(false);

  const timeoutRef = useRef<number | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(asset.fileUrl);
      setCopy(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setCopy(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-[5px] h-auto">
      <div className={styles.assetContainer}>
        {!loaded && (
          <div className={`${styles.images} ${styles.loading}`}>
            <Ring size="40" stroke="5" bgOpacity="0" speed="2" color="var(--color-primary)" />
          </div>
        )}

        <Button
          className="absolute z-1 top-3 right-3 cursor-pointer hover:text-[var(--color-primary)]"
          onClick={handleCopy}
        >
          <Copy size={20} strokeWidth={3} />
        </Button>

        {/* Copy screen */}
        <div className={`${styles.assetCopy} ${copy ? "block" : "hidden"}`}>
          <span>Copied!</span>
        </div>

        {/* See background hover */}
        <div className="group relative">
          <Button className={styles.assetSee} onClick={() => onFullscreen(asset.fileUrl)}>
            <Fullscreen size={40} className="text-white" />
          </Button>
        </div>

        <img
          src={asset.fileUrl}
          alt="asset img"
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={styles.images}
        />
      </div>
      <div className="text-[13px] md:text-[15px] text-center font-medium line-clamp-1 w-[130px]">
        {!loaded ? (
          <div className="w-[120px] md:w-[150px] h-[20px] bg-[var(--color-dark)]/40 rounded-sm" />
        ) : (
          asset.name
        )}
      </div>
      <div className="text-[13px]truncate leading-none">
        {!loaded ? <div className="w-[80px] h-[20px] bg-[var(--color-dark)]/20 rounded-sm" /> : asset.sizeFormatted}
      </div>
    </div>
  );
});
