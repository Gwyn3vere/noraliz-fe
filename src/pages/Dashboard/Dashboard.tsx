import { lazy, Suspense } from "react";
// import { dashboardStyles as styles } from "./Dashboard.styles";
import Navigation from "./Navigation";
import { useState } from "react";
import type { TabMenuType } from "@/types";
import InlineLoader from "../Loading/InlineLoader";

const Projects = lazy(() => import("./Projects"));
const UICustom = lazy(() => import("./UICustom"));
const Assets = lazy(() => import("./Assets"));

const TAB_COMPONENTS = {
  projects: Projects,
  assets: Assets,
  "ui customs": UICustom,
  settings: () => <div>Settings</div>,
};

export default function Dashboard() {
  const [tab, setTab] = useState<TabMenuType>("projects");
  const ActiveTab = TAB_COMPONENTS[tab];

  return (
    <div className="flex-1">
      <Navigation tab={tab} onChangeTab={setTab} />

      <Suspense fallback={<InlineLoader tab={tab} />}>
        <ActiveTab />
      </Suspense>
    </div>
  );
}
