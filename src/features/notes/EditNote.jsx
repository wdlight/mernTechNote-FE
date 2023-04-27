import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { selectNoteById } from "./notesApiSlice"
import { selectAllUsers } from "../users/UsersApiSlice"
import EditNoteForm from "./EditNoteForm"


const EditNote = () => {

  const { id } = useParams()
  const note = useSelector( state => selectNoteById(state, id))
  const users = useSelector(selectAllUsers)

  console.log ( "EditNote page --")
  console.log ( users )
  const content = note && users 
    ? <EditNoteForm note={note} users={users}/> 
    : <p>Loading...</p>

  return content
}

export default EditNote
