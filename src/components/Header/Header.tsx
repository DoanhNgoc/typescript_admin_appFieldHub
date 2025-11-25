import { signOut } from "firebase/auth";
import { useState } from "react";
import { Button, Dropdown, DropdownButton, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
interface value {
    setShowOffcanvas: React.Dispatch<React.SetStateAction<boolean>>;
    setShowLaptop: React.Dispatch<React.SetStateAction<boolean>>;
    user?: any;

}
// mobile offcanvas
export default function Header({ setShowOffcanvas, setShowLaptop, user }: value) {
    const [expanded, setExpanded] = useState(true)
    const [show, setShow] = useState(false);

    const handleClickMoblie = () => {
        setShow(!show)
        setShowOffcanvas(show)
    }
    const handleClickLaptop = () => {
        setExpanded(!expanded)
        setShowLaptop(expanded)

    }
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/"); // quay lại trang login
        } catch (error) {
            console.error("Lỗi khi logout:", error);
        }
    };
    return (
        <Navbar bg="dark" data-bs-theme="dark" className='px-1 px-sm-2 px-lg-3 px-xl-4 px-xxl-5 w-100 d-flex justify-content-between m-0'>
            <Navbar.Brand href="#home" className=' fw-bold fs-2   d-flex align-items-center text-info'>
                FieldHub
            </Navbar.Brand>
            <div className="d-flex align-items-center">
                <div className="d-flex align-items-center">
                    {/* Nút toggle */}
                    <Button
                        variant="outline-info"
                        className="border-0 me-2 d-lg-none" // chỉ hiện trên mobile/tablet
                        onClick={handleClickMoblie}
                    >
                        <i className="bi bi-list fs-3"></i>
                    </Button>
                    <Button
                        variant="outline-info"
                        className="border-0 me-2 d-none d-lg-inline" // chỉ hiện trên laptop+
                        onClick={handleClickLaptop}
                    >
                        <i className="bi bi-list fs-3"></i>
                    </Button>
                </div>
                <DropdownButton
                    align="end"
                    title={<i className="bi bi-bell-fill fs-5 text-secondary"></i>}
                    id="dropdown-menu-align-end"
                    variant="dark"
                    className="no-caret " >
                    <Dropdown.Item eventKey="1" className='py-2 my-0'>
                        <i className="bi bi-box-arrow-right fs-5 me-2"></i><span>Logout</span>
                    </Dropdown.Item>
                    <Dropdown.Divider className='my-0' />
                    <Dropdown.Item eventKey="2" className='py-2 d-flex align-items-center'><i className="bi bi-gear fs-5 me-2"></i><span>Account</span></Dropdown.Item>
                    <Dropdown.Divider className='my-0' />
                    <Dropdown.Item eventKey="3" className='py-2 my-0'><i className="bi bi-box-arrow-right fs-5 me-2"></i><span>Logout</span></Dropdown.Item>


                </DropdownButton>
                <DropdownButton
                    align="end"
                    title={<i className="bi bi-person-circle fs-3"></i>}
                    id="dropdown-menu-align-end"
                    variant="dark"
                    className="no-caret " >
                    <Dropdown.Item eventKey="1" className='d-flex align-items-center'>
                        <i className="bi bi-person-circle fs-1 me-2"></i>
                        <div className='infomation'>
                            <p className="name text-info  p-0 m-0">
                                {user?.name || "no name"}
                            </p>
                            <p className="mail text-secondary p-0 m-0 small">
                                {user?.email || "no email"}
                            </p>
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="3" className='py-1 d-flex align-items-center text-primary' onClick={() => { handleLogout() }}><i className="bi bi-box-arrow-right fs-5 me-2"></i><span>Logout</span></Dropdown.Item>


                </DropdownButton>
            </div>
        </Navbar>
    )
}