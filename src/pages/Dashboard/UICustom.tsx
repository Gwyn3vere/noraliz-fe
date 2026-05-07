import classNames from "classnames/bind";
import { dashboardStyles as styles } from "./Dashboard.styles";
import EmptySpace from "./EmptySpace";
import { images } from "@/assets/images";

const cx = classNames.bind(styles);

const data = null;

export default function UICustom() {
  return data !== null ? (
    <div className={cx("flex items-center justify-center min-h-screen")}>
      <h1 className="text-3xl font-bold">UI Customs</h1>
    </div>
  ) : (
    <EmptySpace
      icon={images.emptyUICustom}
      title="UI Custom is coming"
      content="Soon you'll be able to create and save your own custom components, just like a pro developer. We're building the tools to make it happen."
    />
  );
}
