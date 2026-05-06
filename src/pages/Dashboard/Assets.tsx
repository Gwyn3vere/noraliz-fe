import classNames from "classnames/bind";
import { dashboardStyles as styles } from "./Dashboard.styles";

const cx = classNames.bind(styles);

export default function Assets() {
  return (
    <div className={cx("flex items-center justify-center min-h-screen")}>
      <h1 className="text-3xl font-bold">Assets</h1>
    </div>
  );
}
