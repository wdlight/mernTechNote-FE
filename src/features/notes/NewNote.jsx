import { useSelector } from "react-redux"
import { selectAllUsers } from "../users/UsersApiSlice"
import NewNoteForm from "./NewNoteForm"

const NewNote = () => {
  const users = useSelector(selectAllUsers)
  
  // user가 없는 경우에 대해서 
  if ( !users?.length ) return <p>Not Currently Aailable.</p>
  
  const content = users ? <NewNoteForm users={users} /> : <p>Loading...</p>

  return content
}

export default NewNote
