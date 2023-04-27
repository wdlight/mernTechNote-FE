
import { Outlet } from "react-router-dom"
import DashHeader from "./DashHeader"
import DashFooter from "./DashFooter"

// Login 이후의 layout 기본 화면 틀을 제공한다
const DashLayout = () => {
  return (
    <>
      <DashHeader />
      <div className="dash-container"> 
        <Outlet />
      </div>
      <DashFooter />
    </>
  )

}
export default DashLayout
