import React from "react";

import Search from "../screens/Search";
import Downloads from "../screens/Downloads";
import Drive from "../screens/Drive";
import TopNav from "../components/TopNav";

export default function Home({ tab, driveProps, searchProps }) {
  const nav = tab || "search";

  return (
    <>
      <TopNav nav={nav} setNav={() => {}} />
      <main>
        <div className="content">
          {nav === "search" && <Search searchProps={searchProps} />}
          {nav === "downloads" && <Downloads />}
          {nav === "drive" && <Drive driveProps={driveProps} />}
        </div>
      </main>
    </>
  );
}
