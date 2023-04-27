import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faRightFromBracket ,
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import useAuth from "../hooks/useAuth"


const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/


const DashHeader = () => {
  const { isManager, isAdmin, status, roles } = useAuth()

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation()

  useEffect( () => {
    if ( isSuccess ){

      navigate('/')
    }
  }, [isSuccess, navigate])

  const onNewNoteClicked = () => navigate('/dash/notes/new')
  const onNewUserClicked = () => navigate('/dash/users/new')
  const onUsersClicked = () => navigate('/dash/users')
  const onNotesClicked = () => navigate('/dash/notes')





  const onLogoutClicked = () => sendLogout()

  // if ( isLoading ) return <div>Logging out...</div>
  // if ( isError ) return <div>{error?.data?.message}</div>

  let dashClass = null
  if ( !DASH_REGEX.test( pathname) && !NOTES_REGEX.test( pathname) && !USERS_REGEX.test( pathname) ){
    dashClass = 'dash-header__container--small'
  }


  const notesButton = (
    <button
      className="icon-button"
      onClick={onNotesClicked}
      title="View techNotes"
    >
      <FontAwesomeIcon icon={faFilePen} />
    </button>
  )

  const newNoteButton = (
    <button
      className="icon-button"
      onClick={onNewNoteClicked}
      title="Add New techNotes"      
    >   
      <FontAwesomeIcon icon={faFileCirclePlus} />
    </button>
  )

  const usersButton = (
    <button
      className="icon-button"
      onClick={onUsersClicked}
      title="View User Settings"
    >
      <FontAwesomeIcon icon={faUserGear} />
    </button>
  )

  const newUserButton = (
    <button
      className="icon-button"
      onClick={onNewUserClicked}
      title="Add New User Settings"
    >
      <FontAwesomeIcon icon={faUserPlus} />
    </button>
  )





  const logoutButton = (
    <button 
      className="icon-button" 
      onClick={onLogoutClicked}>

      <FontAwesomeIcon icon={faRightFromBracket} />
      
    </button>

  )

  
  const navButtons = 
  !isLoading ? 
  (
    <>
      {notesButton}
      {newNoteButton}
      {(isManager || isAdmin) && 
        !USERS_REGEX.test( pathname) && 
        pathname.includes('/dash') &&
        usersButton}
      {(isManager || isAdmin ) && 
        !NOTES_REGEX.test(pathname) && pathname.includes('/dash') &&
        newUserButton}
      {logoutButton}
    </>
  ):
  <p>Logging Out...</p>

  const errClass = isError ? "errmsg" : "offscreen"

  return (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
          <Link to="/dash/notes">
            <h1 className="hash-header__title">techNotes {status}</h1>
          </Link>
          <nav className="dash-header__nav">
            {/* nav buttons below */}
            {navButtons}          
            {/* {logoutButton} */}
          </nav>

        </div>

        
      </header>
    </>
  )
}

export default DashHeader
