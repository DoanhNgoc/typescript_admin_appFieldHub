import { useState } from "react";
import Controller from "../components/Controller/Controller";
import Header from "../components/Header/Header";
import { Col, Container, Offcanvas, Row } from "react-bootstrap";
import Dashboard from "../pages/Dashboard/Dashboard";
import ListPartner from "../pages/Partner/ListPartner";
import PendingApproval from "../pages/Partner/NewPartner/PendingApproval";
import Refuse from "../pages/Partner/NewPartner/Refuse";
import Violate from "../pages/Partner/ContractContent/Violate";
import InforContract from "../pages/Partner/ContractContent/InforContract";
import ListCustomer from "../pages/Customer/ListCustomer";
import CustomerService from "../pages/Customer/CustomerService";
import ProfileCustomer from "../pages/Customer/ProfileCustomer";
import { useLocation } from "react-router-dom";


export default function MainLayout() {
    const [expanded, setExpanded] = useState(true) //laptop
    const [showOffcanvas, setShowOffcanvas] = useState(false); // mobile offcanvas
    const [activePage, setActivePage] = useState<string>("HomeDashboard");
    const location = useLocation();
    const user = location.state?.user;

    //profile 
    const [selectedUser, setSelectedUser] = useState<any>(null);
    //render click content from controller
    const renderContent = () => {
        switch (activePage) {
            //dashboard
            case "Dashboard":
                return <Dashboard />;
            //partner
            case "ListPartner":
                return <ListPartner />

            //newpartner
            //-->pending approval
            case "PendingApproval":
                return <PendingApproval />
            //-->refuse
            case "Refuse":
                return <Refuse />

            //violate
            case "Violate":
                return <Violate />
            //infomation contract 
            case "InforContract":
                return <InforContract />

            //customer
            //-->list customer
            case "ListCustomer":
                return <ListCustomer onSelectProfile={(user) => {
                    setSelectedUser(user);
                    setActivePage("ProfileCustomer");
                }} />
            //-->customer service
            case "CustomerService":
                return <CustomerService />
            case "ProfileCustomer":
                return <ProfileCustomer user={selectedUser} />;
        }
    }
    return <div>
        <Header setShowOffcanvas={setShowOffcanvas} setShowLaptop={setExpanded} user={user} />
        <Container fluid>
            <Row>
                {/* Sidebar cho màn hình lg↑ */}
                {expanded && (
                    <Col
                        lg={2}
                        className="bg-dark border-end border-secondary d-none d-lg-block p-2 min-vh-100"
                    >
                        <Controller onSelectPage={setActivePage} />

                    </Col>
                )}

                {/* Content */}
                <Col className="p-4">
                    {renderContent()}
                </Col>
            </Row>
        </Container>

        {/* Offcanvas cho mobile/tablet */}
        <Offcanvas
            show={showOffcanvas} // dùng state từ App
            onHide={() => setShowOffcanvas(false)} // khi click close → tắt state App
            placement="start"
            className="bg-dark text-light d-lg-none"
            style={{ top: "65px" }}
        >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Controller onSelectPage={setActivePage} />
            </Offcanvas.Body>
        </Offcanvas>
    </div>
}
{/* <Controller onSelectPage={setActivePage} /> */ }