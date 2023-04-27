import React from 'react'
import { useState, useEffect } from 'react'
import { useAddNewUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons'
import { ROLES } from '../../config/roles'

const USER_REGEX = /^[a-zA-Z0-9]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {

  const [ addNewUser, { isLoading, isSuccess, isError, error } ] = useAddNewUserMutation()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [roles, setRoles] = useState(["Employee"])


  useEffect ( () => {
    setValidUsername ( USER_REGEX.test( username ))
  }, [username])

  useEffect ( () => {
    setValidPassword ( PWD_REGEX.test( password ))
  }, [password])

  useEffect ( () => {
    if ( isSuccess ) 
    {
      setUsername('')
      setPassword('')
      setRoles([])
      navigate('/dash/users')
    }
  }, [isSuccess, navigate])

  const onUsernameChanged = e => setUsername(e.target.value)
  const onPasswordChanged = e => setPassword(e.target.value)

  const onRolesChanged = e => {
    const values = Array.from(e.target.selectedOptions, option => option.value)
    setRoles(values)
  }

  const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
  const onSaveUserClicked = async () => {
    if ( canSave )
    {
      await addNewUser({ username, password, roles })
    }
  }

  const options = Object.values( ROLES ).map( role => 
    <option key={role} value={role}>{role}</option>)

  const errClass = isError ? 'errmsg' : 'offscreen'
  const validUserClass = !validUsername ? 'form__input--incomplete' : ''
  const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
  const validRolesClass = !Boolean( roles.length ) ? 'form__input--incomplete' : ''


  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveUserClicked}>
        <div className="form__tile-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled = {!canSave}
              onClick={onSaveUserClicked}
              >
              <FontAwesomeIcon icon={faSave} />
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

export default NewUserForm
