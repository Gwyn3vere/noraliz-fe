import { Outlet } from "react-router-dom";
import { authLayoutStyles as styles } from "./AuthLayout.styles";
import { images } from "@/assets/images";
import { useDateTime } from "@/components/hooks/useDateTime";

export default function AuthLayout() {
  const { month, day, year, time } = useDateTime();

  return (
    <main className={`${styles.container}`}>
      <div className={styles.shape}>
        <img src={images.txVertical} alt="Noraliz Compass" className={styles.shapeImage} />
      </div>
      <div className={styles.content}>
        <div className="flex items-center justify-end gap-[40px]">
          <InfoBase title="System" content="Noraliz Core" />
          <InfoBase title="Time" content={time} />
          <InfoBase title="Status" content="Operational" />
          <InfoDate month={month} day={day} year={year} />
        </div>
        <div className="flex flex-col items-end gap-[15px]">
          <InfoMore title="system status:" content="ready to launch" />
          <InfoMore title="est. 2026 //:" content="no-code revolution" />
          <InfoMore title="designed for the next generation of creators" content="" />
        </div>
      </div>

      <Outlet />
    </main>
  );
}

function InfoBase({ title, content }: { content: string; title: string }) {
  return (
    <div className={styles.textBase}>
      <strong>{title}</strong>
      <div>{content}</div>
    </div>
  );
}

function InfoMore({ title, content }: { content: string; title: string }) {
  return (
    <div className={styles.textStyle}>
      <span>{title}</span> <span>{content}</span>
    </div>
  );
}

function InfoDate({ month, day, year }: { month: string; day: string; year: string }) {
  return (
    <div className={styles.dateBase}>
      <span className={styles.dateMonth}>{month}</span>
      <div className={styles.dateDayYear}>
        <span>{day}</span>
        <span>{year}</span>
      </div>
    </div>
  );
}
