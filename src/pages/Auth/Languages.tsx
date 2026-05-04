import { authStyles as styles } from "./Auth.styles";
import { images } from "@/assets/images";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

function Languages() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  return (
    <div className={styles.languages}>
      <div className={styles.icon}>noraliz</div>
      <div className="relative">
        {/* dropdown toggle */}
        <div className={styles.toggle} onClick={() => setIsDropdownOpen((prev) => !prev)}>
          <img
            src={selectedLanguage === "en" ? images.flagEnglish : images.flagVietnam}
            alt="Language flag"
            className="w-[25px] h-[25px]"
          />
          {selectedLanguage === "en" ? "ENG" : "VIE"}
          <ChevronDown size={10} strokeWidth={3} />
        </div>
        {/* dropdown menu */}
        {isDropdownOpen && (
          <div className={styles.dropdown}>
            <div
              className={styles.dropdownItem}
              onClick={() => {
                setIsDropdownOpen(false);
                setSelectedLanguage("en");
              }}
            >
              <img src={images.flagEnglish} alt="English flag" className="w-[25px] h-[25px]" />
              ENG
            </div>
            <div
              className={styles.dropdownItem}
              onClick={() => {
                setIsDropdownOpen(false);
                setSelectedLanguage("vi");
              }}
            >
              <img src={images.flagVietnam} alt="Vietnamese flag" className="w-[25px] h-[25px]" />
              VIE
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Languages;
