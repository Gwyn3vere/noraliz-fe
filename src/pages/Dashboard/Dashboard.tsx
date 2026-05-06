import React, { Suspense } from "react";
// import { dashboardStyles as styles } from "./Dashboard.styles";
import Navigation from "./Navigation";
import { useState } from "react";
import type { TabMenuType } from "@/types/tabTypes";

const Projects = React.lazy(() => import("./Projects"));
const Assets = React.lazy(() => import("./Assets"));

const TAB_COMPONENTS = {
  projects: Projects,
  assets: Assets,
  uicustom: () => <div>UI Custom</div>,
  settings: () => <div>Settings</div>,
};

export default function Dashboard() {
  const [tab, setTab] = useState<TabMenuType>("projects");
  const ActiveTab = TAB_COMPONENTS[tab];

  return (
    <div>
      <Navigation tab={tab} onChangeTab={setTab} />
      <div className="flex items-center justify-center min-h-screen">
        <Suspense fallback={<div>Loading...</div>}>
          <ActiveTab />
        </Suspense>
      </div>
    </div>
  );
}
