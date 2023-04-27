
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useNavigate } from "react-router-dom";

import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useGetNotesQuery } from "./notesApiSlice";
import { memo } from "react";

// import { useSelector } from "react-redux";
// import { selectNoteById } from "./notesApiSlice";

const Note = ({noteId}) => {

  // const note = useSelector( state => selectNoteById(state, noteId))
  const {note} = useGetNotesQuery( "notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId]
    })
  })
  const navigate = useNavigate()

  if ( note )
  {
    const handleEdit = () => navigate(`/dash/notes/${noteId}`)    
    const createdAt = new Date(note.createdAt).toLocaleString( 'ko-KR',{ day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' })
    const updatedAt = new Date(note.updatedAt).toLocaleString( 'ko-KR',{ day: 'numeric', month: 'long',  hour: 'numeric', minute: 'numeric' })

    console.log ( " 🚩🚩🚩🚩 note: ")
    console.log ( note )
    return (
      <tr className="table_row note_status">                   
          <td className="table__cell note__status">
                    {note.completed
                        ? <span className="note__status--completed">Completed</span>
                        : <span className="note__status--open">Open</span>
                    }
          </td>
          <td className="table__th note__created">{createdAt}</td>
          <td className="table__th note__updated">{updatedAt}</td>
          <td className="table__th note__title">{note.title}</td>
          <td className="table__th note__username">{note.username}</td>
          <td className={`table__cell `}>
            <button className="icon-button table__button" title="Edit Note"
              onClick={handleEdit}>            
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>  
          </td>  
      </tr>
    )
  }
  else return null

}

const memoizedNote = memo(Note)
export default memoizedNote



