import { cn } from "@/lib/utils";

// header
const headerBase = "bg-[var(--color-light)] fixed z-10 top-0 md:border-b border-[var(--color-dark)]/10";
const headerSize = "w-full h-[70px] md:h-[100px]";
const headerSpace = "px-[15px] py-0 md:px-[40px] md:py-[20px]";
const headerLayout = "flex items-center justify-between";

// logo
const logoBase = "bg-[var(--color-primary)] rounded-[10px]";
const logoSize = "w-[40px] h-[40px] md:w-[50px] md:h-[50px]";

// brand
const brandSize = "font-display font-bold text-[25px] md:text-[30px]";

// notification
const notiBase = "rounded-full bg-[var(--color-primary)] border-2 border-[var(--color-light)]";
const notiLayout = "flex items-center justify-center";
const notiSize = "w-[20px] h-[20px]";
const notiPosition = "absolute top-0 -right-1.5";

// user
const userBase = "relative cursor-pointer";
const userLayout = "flex items-center gap-[5px]";

// avatar
const avatarBase = "bg-[var(--color-dark)]/20 rounded-full";
const avatarSize = "w-[40px] h-[40px]";

// menu
const menuBase = "rounded-[10px] shadow-[var(--shadow-sm)] bg-[var(--color-light)]";
const menuSize = "w-[200px] h-[300px]";
const menuPosition = "absolute right-0 top-[45px] z-10";
const menuSpace = "p-[20px]";

export const sharedStyles = {
  headerContainer: cn(headerBase, headerSize, headerSpace, headerLayout),

  logo: cn(logoBase, logoSize),
  brand: cn(brandSize),

  notification: cn(notiBase, notiLayout, notiPosition, notiSize),

  userDropdown: cn(userBase, userLayout),
  menuDropdown: cn(menuBase, menuPosition, menuSize, menuSpace),
  avatar: cn(avatarBase, avatarSize),
};
