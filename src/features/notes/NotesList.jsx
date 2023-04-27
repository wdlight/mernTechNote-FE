import { useGetNotesQuery } from './notesApiSlice'
import Note from './Note'
import useAuth from '../../hooks/useAuth'

const NotesList = () => {
  const { username, isManager, isAdmin } = useAuth()

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error 
  } = useGetNotesQuery( 'noteList',
    {
      pollingInterval: 15000, // 15초마다 polling
      refetchOnFocus: true,  // 다른 화면에 갔다가 다시 오는 경우에 refetch
      refetchOnMoutOrArgChange: true
    })

  let content 
  if ( isLoading ) content = <div>Loading...</div>
  if ( isError ) 
    content = <p className="errmsg">{error?.data?.message}</p>

  if ( isSuccess ) {
    const { ids, entities } = notes

    let filteredIds
    if ( isManager || isAdmin ){
      filteredIds = [...ids]      
    } else {
      filteredIds = ids.filter( id => entities[id].username === username)
    }



      const tableContent 
        = ids?.length && filteredIds.map( noteId => 
        (<Note key={noteId} noteId={noteId}></Note>) )
        
      // const tableContent = ids?.length 
      // ? ids.map( noteId => 
      //   (<Note key={noteId} noteId={noteId}></Note>) )        
      // : null 
    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">Status</th>
            <th scope="col" className="table__th note__created">Created </th>
            <th scope="col" className="table__th note__updated">Updated</th>
            <th scope="col" className="table__th note__title">Title</th>
            <th scope="col" className="table__th note__username">Owner</th>
            <th scope="col" className="table__th note__edit">Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>

      </table>
    )
  }

  

  return content
}

export default NotesList
