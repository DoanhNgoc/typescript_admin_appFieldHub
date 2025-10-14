import { useEffect, useState } from "react"
import Login from "../pages/Login/Login"
import { Toast, ToastContainer } from "react-bootstrap"
export default function AuthLayout() {
    const [show, setShow] = useState(false)
    const handlecloseToast = () => {
        setShow(false)
    }
    useEffect(() => {
        console.log(show)

    }, [show])
    return <div
        className="min-vh-100 w-100 m-0 p-0 d-flex justify-content-center align-items-center position-relative bg-secondary">
        {show ? <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
            <Toast bg="danger">
                <Toast.Header onClick={handlecloseToast}>

                    <strong className="me-auto">error Login</strong>
                </Toast.Header>
                <Toast.Body className="text-light">Login failed</Toast.Body>
            </Toast>
        </ToastContainer> : <span></span>}
        <Login setShow={setShow} />

    </div>
}