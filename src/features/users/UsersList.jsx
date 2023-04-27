import { useGetUsersQuery } from './usersApiSlice'
import User from './User'

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error 
  } = useGetUsersQuery( 'usersList',
    {
      pollingInterval: 60000,
      refetchOnFocus: true,  // 다른 화면에 갔다가 다시 오는 경우에 refetch
      refetchOnMoutOrArgChange: true
    }
    
  )

  
  let content 
  if ( isLoading ) content = <div>Loading...</div>
  if ( isError ) 
    content = <p className="errmsg">{error?.data?.message}</p>

  if ( isSuccess ) {
    const { ids } = users
    const tableContent = ids?.length 
      && ids.map( userId => (<User key={userId} userId={userId}></User>) )        
      
    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">Username</th>
            <th scope="col" className="table__th user__roles">Roles</th>
            <th scope="col" className="table__th user__edit">Edit</th>
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

export default UsersList
