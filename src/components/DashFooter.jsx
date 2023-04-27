import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"




const DashFooter = () => {
  const { username, roles } = useAuth()


  const navigate = useNavigate()
  const { pathname } = useLocation()

  let goHomeButton = null
  if (pathname !== "/dash") {
    goHomeButton = (
      <button className="dash-footer__button icon-button"
        title="Home"
        onClick={() => navigate("/dash")}>
        <FontAwesomeIcon icon={faHouse} />
      </button>
    )
  }

  return (
    <footer className="dash-footer">
      
        {goHomeButton}
        
        <p>Current User: {username} </p>
        <p>Status: {roles}</p>
      

      
    </footer>
  )
}

export default DashFooter
