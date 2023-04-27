
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserById } from "./usersApiSlice";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { memo } from "react";



const User = ({userId}) => {
  const user = useSelector( state => selectUserById(state, userId))
  const navigate = useNavigate()

  if ( user )
  {
    const handleEdit = () => navigate(`/dash/users/${userId}`)
    const userRolesString = user.roles.toString().replaceAll( ',', ', ')
    const cellStatus = user.active ? '' : 'table__cell--inactive'
    
    return (
      <tr className="table_row user">
          <td className={`table__cell ${cellStatus}`}>{user.username}</td>
          <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
          <td className={`table__cell ${cellStatus}`}>
            <button className="icon-button table__button" title="Edit User"
              onClick={handleEdit}>            
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>  
          </td>  
      </tr>
    )
  }
  else return null

}

const memoizedUser = memo(User)

export default memoizedUser



