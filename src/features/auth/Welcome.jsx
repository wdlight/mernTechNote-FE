import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"


const Welcome = () => {
  const { username, isManager, isAdmin} = useAuth()

  const date = new Date()
  // KOrean date format
  const today = new Intl.DateTimeFormat("ko-KR", { dateStyle: "full" }).format(date)
  
  return (
    <section className="welcome">
      <p>{today}</p>
      <h1>Welcome {username}</h1>
      <p><Link to="/dash/notes">View techNotes</Link></p>
      <p><Link to="/dash/notes/new">Add New techNotes</Link></p>
      
      {
      (isManager || isAdmin) && 
      (<p><Link to="/dash/users">View User Settings</Link></p>     )
      }
      
      {(isManager || isAdmin) && 
      <p><Link to="/dash/users/new">Add New User Settings</Link></p>
      }

    </section>
  )
}

export default Welcome
