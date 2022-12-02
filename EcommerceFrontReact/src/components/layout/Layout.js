import { Outlet } from "react-router-dom"
import Menu from "./Menu"

function Layout(props) {
    return <div>
       <Menu/>
       <div>
          <Outlet />   
       </div> 
    </div>
}

export default Layout