import classNames from "classnames/bind";
import { dashboardStyles as styles } from "./Dashboard.styles";
import EmptySpace from "./EmptySpace";
import { images } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";

const cx = classNames.bind(styles);

const data = null;

export default function Assets() {
  return data !== null ? (
    <div className={cx("flex items-center justify-center min-h-screen")}>
      <h1 className="text-3xl font-bold">Assets</h1>
    </div>
  ) : (
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
  );
}
