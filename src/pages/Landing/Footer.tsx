import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const FOOTER_MENU = [
  {
    id: 1,
    title: "Product",
    list: [
      { id: "1", name: "Features", sectionId: "#features" },
      { id: "2", name: "Components", sectionId: "#components" },
      { id: "3", name: "Templates", sectionId: "#templates" },
      { id: "4", name: "Workflow", sectionId: "#workflow" },
      { id: "5", name: "Builders", sectionId: "#Builders" },
    ],
  },
  {
    id: 2,
    title: "Resources",
    list: [
      { id: "1", name: "Docs", url: "#" },
      { id: "2", name: "Guides", url: "#" },
      { id: "3", name: "Changelog", url: "#" },
      { id: "4", name: "Roadmap", url: "#" },
    ],
  },
  {
    id: 3,
    title: "Community",
    list: [
      { id: "1", name: "Github", url: "#" },
      { id: "2", name: "Discord", url: "#" },
      { id: "3", name: "Facebook", url: "#" },
      { id: "4", name: "Youtube", url: "#" },
    ],
  },
  {
    id: 4,
    title: "Noraliz",
    list: [
      { id: "1", name: "About", url: "#" },
      { id: "2", name: "Blog", url: "#" },
      { id: "3", name: "Careers", url: "#" },
      { id: "4", name: "Contract", url: "#" },
    ],
  },
];

function Footer() {
  return (
    <footer className={cn("bg-[var(--color-dark)] w-full min-h-150", "mt-[50px] flex items-center justify-center")}>
      <div className={cn("w-[1420px] py-[50px] md:mx-auto", "text-[var(--color-light)]", "grid grid-cols-3 gap-12")}>
        {/* Left */}
        <div className="flex flex-col justify-between">
          <div className={cn("space-y-3")}>
            <div className={cn("order-2 lg:order-1", "flex items-center gap-2.5")}>
              <div
                className={cn(
                  "w-[40px] h-[40px]",
                  "rounded-[10px] bg-[var(--color-primary)]",
                  "border border-transparent",
                )}
              />
              <span className={cn("font-display uppercase", "text-[20px] font-black")}>Noraliz</span>
            </div>
            <p className={cn("font-medium text-[var(--color-light)]/50 text-[14px]")}>
              The visual workspace for building modern web <br /> experiences. Design, build, and launch faster.
            </p>
          </div>

          <span className="text-[12px] text-[var(--color-light)]/50">© 2026 Noraliz. All rights reserved.</span>
        </div>

        {/* Mid */}
        <div className={cn("flex justify-between gap-5")}>
          {FOOTER_MENU.map((item) => {
            return <List key={item.id} title={item.title} list={item.list} />;
          })}
        </div>

        {/* Right */}
        <div className="space-y-7">
          <div className="uppercase font-bold">Get Started</div>
          <p className={cn("font-medium text-[var(--color-light)]/50 text-[14px]")}>
            Join creators, startups, and agencies already building with Noraliz.
          </p>
          <Link to="/">
            <div className={cn("bg-[var(--color-primary)] rounded-full py-4 px-3", "text-center font-bold")}>
              Start Building
            </div>
          </Link>
          <div className={cn("mt-10 flex itemx-center justify-end gap-5", "text-[12px] text-[var(--color-light)]/50")}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

interface MenuItem {
  name: string;
  id?: string;
  url?: string;
  sectionId?: string;
}

interface ListMenuProps {
  title?: string;
  list?: MenuItem[];
}

function List({ title, list }: ListMenuProps) {
  return (
    <div className="flex-1 space-y-2">
      <div className="uppercase font-bold">{title}</div>

      {list.map((item) => {
        return (
          <div key={item.id} className={cn("font-medium text-[14px] text-[var(--color-light)]/50")}>
            {item.name}
          </div>
        );
      })}
    </div>
  );
}
