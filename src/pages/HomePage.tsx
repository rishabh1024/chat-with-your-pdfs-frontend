import { TopBar } from "@/components/TopBar"
import { Sidebar } from "@/components/SideBar"
import { useState } from "react"
import "@/styles/global.css"
import "@/styles/Sidebar.css"
import { Outlet } from "react-router-dom"

export function HomePage() {
  
  const [isSideBarOpen, setisSideBarOpen] = useState(false)

  return (
    <div className="home-page">
      {isSideBarOpen && (
          <>
            <div
              className="sidebar-backdrop"
              onClick={() => setisSideBarOpen(false)}
            />
            <Sidebar onClose={() => setisSideBarOpen(false)} />
          </>
        )}
      <TopBar onOpenSidebar={() => setisSideBarOpen(true)} />
      <Outlet />
    </div>
  )

}
