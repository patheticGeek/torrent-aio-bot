import React, { useState } from "react";

import Search from "../screens/Search";
import Downloads from "../screens/Downloads";
import Drive from "../screens/Drive";
import TopNav from "../components/TopNav";

export default function Home() {
  const [nav, setNav] = useState("search");

  return (
    <>
      <TopNav nav={nav} setNav={setNav} />
      <main>
        <div className="content">
          {nav === "search" && <Search />}
          {nav === "downloads" && <Downloads />}
          {nav === "drive" && <Drive />}
        </div>
      </main>
    </>
  );
}
