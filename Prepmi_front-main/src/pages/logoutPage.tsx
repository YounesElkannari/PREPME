import { webRoutes } from "@/routes/web"
import { logout } from "@/store/slices/adminSlice"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

 
export default function logoutPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(logout())
        navigate(webRoutes.home)
    }, [])

  return (
    <div>logout</div>
  )
}
