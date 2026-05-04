import { useState, useEffect } from "react";

interface DateTimeParts {
  month: string;
  day: string;
  year: string;
  time: string;
}

function getDateTimeParts(): DateTimeParts {
  const date = new Date();

  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours24 >= 12 ? "pm" : "am";
  const time = `${hours12}:${minutes} ${ampm}`;

  return { month, day, year, time };
}

export function useDateTime(): DateTimeParts {
  // Lấy giá trị lần đầu tiên, bao gồm cả month, day, year không thay đổi
  const [dateTime, setDateTime] = useState<DateTimeParts>(getDateTimeParts);

  useEffect(() => {
    // Mỗi phút, chỉ cập nhật lại time (và nếu qua ngày mới thì sẽ cập nhật luôn cả ngày tháng)
    const interval = setInterval(() => {
      setDateTime(getDateTimeParts());
    }, 60_000); // 60,000ms = 1 phút

    // Dọn dẹp interval khi component bị unmount
    return () => clearInterval(interval);
  }, []);

  return dateTime;
}
