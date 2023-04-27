
import './App.css'
import { Routes, Route} from 'react-router-dom'
import Layout from './components/Layout'
import DashLayout from './components/DashLayout'
import Public from './components/Public'
import Login from './features/auth/Login'
import Welcome from './features/auth/Welcome'
import NotesList from './features/notes/NotesList'
import UsersList from './features/users/UsersList'
import EditNote from './features/notes/EditNote'
import NewNote from './features/notes/NewNote'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import Prefetch from './features/auth/Prefetch'
import PersistLogin  from './features/auth/PersistLogin'
import { ROLES } from './config/roles'
import RequiredAuth from './features/auth/RequireAuth'

function App() {
  

  return (
    <Routes>      
        <Route path="/" element={<Layout />} >
          {/* public routes  */}
          <Route index element={ <Public/>}></Route>
          <Route path="login" element={ <Login/>}></Route>

          {/* Protected Routes */}
          <Route element={<PersistLogin/>}>
          {/* Dash Layout : Login Required */}
            <Route element={<RequiredAuth allowedRoles={[...Object.values(ROLES)]}/>}>
            <Route element={<Prefetch/>}>
              <Route path="dash" element={<DashLayout/>}>
                <Route index element={<Welcome/>}/>
                <Route path="notes">
                  <Route index element={<NotesList/>}></Route>
                  <Route path=":id" element={<EditNote/>}/>
                  <Route path="new" element={<NewNote/>}/>
                </Route>
                
                <Route element={<RequiredAuth allowedRoles={[ROLES.Manager, ROLES.Admin]}/>}>
                  <Route path="users">
                    <Route index element={<UsersList/>}></Route>
                    <Route path=":id" element={<EditUser/>}/>
                    <Route path="new" element={<NewUserForm/>}/>
                  </Route>
                </Route>

              </Route>
            </Route>
            </Route>
          </Route>

        </Route>
    </Routes>
  )
}

export default App

