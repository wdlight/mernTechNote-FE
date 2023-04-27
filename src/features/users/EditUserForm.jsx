import React from 'react'
import { useState, useEffect } from 'react'
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { ROLES } from '../../config/roles'

const USER_REGEX = /^[a-zA-Z0-9]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const EditUserForm = ( {user} ) => {
  const [updateUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateUserMutation()


  const [deleteUser, {    
    isLoading: isDeleteLoading,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
    error: delerror
  }] = useDeleteUserMutation()

  const navigate = useNavigate()

  const [username, setUsername] = useState(user.username)
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [roles, setRoles] = useState(user.roles)
  const [active, setActive] = useState(user.active)
  
  useEffect ( () => {
    setValidUsername ( USER_REGEX.test( username ))
  }, [username])

  useEffect ( () => {
    setValidPassword ( PWD_REGEX.test( password ))
  }, [password])

  useEffect ( () => {
    console.log ( " Patch  Success: ", isSuccess )
    if ( isSuccess )
    {
      setUsername('')
      setPassword('')
      setRoles([])
      navigate('/dash/users')
    }
  }, [isSuccess, navigate])

  useEffect ( () => {
    console.log ( " ⭐⭐⭐ Delete Success?:", isDeleteSuccess )
    if ( isDeleteSuccess )
    {
      setUsername('')
      setPassword('')
      setRoles([])
      navigate('/dash/users')
    }
  }, [isDeleteSuccess, navigate])

  // handler functions
  const onUsernameChanged = e => setUsername(e.target.value)
  const onPasswordChanged = e => setPassword(e.target.value)

  const onRolesChanged = e => {
    const values = Array.from(e.target.selectedOptions, option => option.value)
    setRoles(values)
  }

  const onActiveChanged = e => {
    setActive(e.target.checked)
  }

  const onSaveUserClicked = async (e) => {
    if ( password ) {
      await updateUser({ id: user.id, username, password, roles, active })
    } else {
      await updateUser({ id: user.id, username, roles, active })
    } 
  }

  const onDeleteUserClicked = async (e) => {        
    e.preventDefault()
    await deleteUser( {id: user.id} )
  }

  const options = Object.values( ROLES).map ( role => {
    return (
      <option key={role} value={role}>{role}</option>
    )
  })

  let canSave
  if ( password ) {
    canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading
  }

  const errClass = isError || isDeleteError ? 'errmsg' : 'offscreen'
  const validUserClass = !validUsername ? 'form__input--incomplete' : ''
  const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
  const validRolesClass = !Boolean( roles.length ) ? 'form__input--incomplete' : ''

  const errContent = ( error?.data?.message || delerror?.data?.message ) ?? ''


  const content = (
<>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={e=> e.onSaveUserClicked}>
        <div className="form__tile-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled = {!canSave}
              onClick={onSaveUserClicked}
              >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={(e)=>onDeleteUserClicked(e)}
              >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        <label htmlFor="username" className="form__label">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete='off'
          value={username}
          onChange={onUsernameChanged}
        />

        <label htmlFor="password" className="form__label">
          Password: <span className="nowrap">[4-12 letters, numbers, !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"          
          value={password}
          onChange={onPasswordChanged}
        />

        <label htmlFor="user-active" className="form__label form__checkbox-container">
          ACTIVE:
          <input
            className="form__checkbox"
            id="user-active"
            name="user-active"
            type="checkbox"
            checked={active}
            onChange={onActiveChanged}
          />        
        </label>


        <label htmlFor="role" className="form__label">
          Assigned Roles:
        </label>
        <select
          className={`form__input ${validRolesClass}`}
          id="roles"
          name="roles"
          multiple={true}
          value={roles}
          onChange={onRolesChanged}
          size="3"
        >
          {options}
        </select>

      </form>
    </>


  )


  return content
}

export default EditUserForm
