import { cn } from "@/lib/utils";

// auth container
const authContainer = "relative overflow-hidden bg-[var(--color-light)] md:rounded-[50px]";
const authResponsive = "w-[500px] xl:w-[1200px] h-screen md:h-[800px]";
const authFlex = " flex";
const authShadow = "shadow-[0_0_2px_-8px_rgba(0,0,0,0.25)]";

// shape
const shapeSize = "relative w-[60%] h-full rounded-[50px] bg-cover bg-center";
const shapeResponsive = "hidden xl:block";

// version
const versionStyle = "absolute bottom-10 right-20 text-[13px] font-bold text-white";
const versionFlex = "flex items-center gap-[20px]";

// form
const formContainer = "p-[30px] w-full xl:w-[40%] h-full";
const formBody = "gap-[15px] my-[22px] flex flex-col items-center";
const formSubmitBtn =
  "bg-[var(--color-primary)] !w-[300px] !h-[45px] !rounded-[10px] text-white font-bold cursor-pointer";
const formErrors = "bg-[var(--color-error)] rounded-[10px] py-1 px-2 w-[300px]";
const formSuccess = "bg-[var(--color-success)] rounded-[10px] py-1 px-2 w-[300px]";
const formFlex = "flex gap-2";
const formText = "text-[14px] font-semibold text-white";

// languages
const languagesFlex = "flex items-center justify-between";
const languageIcon = "font-display text-[30px] font-bold uppercase";
const languageToggle = "flex items-center gap-1 font-black text-[14px] cursor-pointer";
const languageDropdown = "absolute top-full -left-2 mt-2 w-auto bg-white rounded shadow-[var(--shadow-sm)]";
const languageItem = "flex items-center gap-1 font-black text-[14px] hover:bg-gray-100 cursor-pointer p-2";

// OAuth
const googleBtnBase = "w-[300px] h-[45px] border border-[var(--color-dark)]/40 rounded-[10px] cursor-pointer";
const googleBtnFlex = "flex items-center justify-center gap-[5px]";
const googleBtnHover = "hover:bg-[var(--color-dark)]/5 transition-all";
const googleIconSize = "w-[25px] h-[25px]";
const googleTextStyle = "text-[14px] font-semibold";

//Have an account yet?
const questionBase = "flex items-center gap-1 text-[12px] font-bold italic";

export const authStyles = {
  container: cn(authContainer, authShadow, authFlex, authResponsive),
  shape: cn(shapeSize, shapeResponsive),
  version: cn(versionStyle, versionFlex),
  form: cn(formContainer),
  formComp: cn(formBody),
  formErrors: cn(formErrors, formFlex, formText),
  formSuccess: cn(formSuccess, formFlex, formText),
  formBtn: cn(formSubmitBtn),
  languages: cn(languagesFlex),
  icon: cn(languageIcon),
  toggle: cn(languageToggle),
  dropdown: cn(languageDropdown),
  dropdownItem: cn(languageItem),
  googleButton: cn(googleBtnBase, googleBtnFlex, googleBtnHover),
  googleIcon: cn(googleIconSize),
  googleTextStyle: cn(googleTextStyle),
  question: cn(questionBase),
};
