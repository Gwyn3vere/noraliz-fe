import { dashboardStyles as styles } from "./Dashboard.styles";
import type { EmptyType } from "@/types";

export default function EmptySpace({ icon, title, content, button }: EmptyType) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.empty}>
        <img src={icon} alt="empty-projects" />
        <div className={styles.emptyText}>
          <span>{title}</span>
          <p className="max-w-[450px]">{content}</p>
        </div>
        {button}
      </div>
    </div>
  );
}
