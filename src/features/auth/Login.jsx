import { useRef, useState, useEffect  } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'


const Login = () => {

  const userRef = useRef()
  const errRef = useRef()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist() 



  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()

  // useEffect 부문
  useEffect(() => {
    userRef.current.focus()

  },[] )
  useEffect(() => {
    setErrMsg('')
  },[username, password] )


  const errClass = errMsg ? 'errmsg' : 'offscreen'

  // Form handler Functions
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try{
      // q: what is unwrap()?
      // a: unwrap() is a function that returns the value of a fulfilled promise
      const { accessToken } = await login({ username, password }).unwrap()
    
      dispatch(setCredentials({ accessToken }))
      setUsername('')
      setPassword('')
      
      navigate('/dash')


    }catch(err){
      if (!err.status){
        setErrMsg('Network Error: No Server Response')
      } else if (err.status === 400){
        setErrMsg('Invalid Username or Password')
      } else if ( err.status === 401 ){
        setErrMsg('Unauthorized: Invalid Username or Password')
      } else {
        setErrMsg( err.data?.message || 'Unknown Error' )
      }
      errRef.current.focus()

    }

  }
  const handleUserinput = (e) => {
    setUsername(e.target.value)

  }
  const handlePwdinput = (e) => {
    setPassword(e.target.value)
  }
  const handleTogglePersist = () => setPersist( prev => !prev)



  if ( isLoading ) return <p> Loading ... </p>

  const content = (
    <>
      <section className="public">
        <header>
          <h1>Employee Login</h1>
        </header>
        <main className="login">
          <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
          
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username: </label>
            <input 
              type="text" 
              className="form__input" 
              id="username"
              ref={userRef}
              value={username}
              onChange={handleUserinput}
              autoComplete='off'
              required
            />
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              className="form__input"
              id="password"              
              value={password}
              onChange={handlePwdinput}
              autoComplete='off'
              required
            />
            <button className="form__submit-button">Sign In</button>

            <label htmlFor="persist">
              <input type="checkbox"
                className="form__checkbox"
                id="persist"
                onChange={handleTogglePersist}
                checked={persist}              
              /> Trust This Device
            </label>
          </form>



        </main>
        <footer>
          <Link to="/">Back to Home</Link>
        </footer>
      </section>
    </>
  )

  return content
}

export default Login
