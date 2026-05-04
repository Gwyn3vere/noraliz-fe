import { cn } from "@/lib/utils";

// background shape
const shapeBase = "absolute inset-0 w-[70%] h-full z-0 overflow-hidden flex items-center justify-between";
const shapeGradient = "bg-linear-[var(--color-gradient-auth)]";
const shapeClip = "[clip-path:polygon(0_0,100%_0,95%_100%,0%_100%)]";

// background information
const contentBase = "absolute w-[30%] h-full top-0 right-0 p-4";
const contentFlex = "flex flex-col justify-between";

// vertial image
const objectFit = "object-cover object-center";
const imageSize = "w-auto h-[100vh] py-4";

// information base
const infoBase = "text-[15px]";
const infoStyle = "uppercase font-bold tracking-widest";

// information date
const dateTimeFlex = "flex items-center";
const month = "text-[12px] uppercase -rotate-90 font-semibold";
const dayYear = "text-[23px] font-black leading-[0.8] flex flex-col";

export const authLayoutStyles = {
  container: "h-screen w-full flex items-center justify-center",
  shape: cn(shapeBase, shapeGradient, shapeClip),
  content: cn(contentBase, contentFlex),
  shapeImage: cn(objectFit, imageSize),

  textBase: cn(infoBase),
  textStyle: cn(infoBase, infoStyle),

  dateBase: cn(dateTimeFlex),
  dateMonth: cn(month),
  dateDayYear: cn(dayYear),
};
