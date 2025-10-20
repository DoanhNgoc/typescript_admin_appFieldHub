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
import ProfilePartner from "../pages/Partner/ProfilePartner";

export default function MainLayout() {
    const [expanded, setExpanded] = useState(true) //laptop
    const [showOffcanvas, setShowOffcanvas] = useState(false); // mobile offcanvas
    const [activePage, setActivePage] = useState<string>("Dashboard");
    const location = useLocation();
    const user = location.state?.user;

    //profile 
    const [selectedUser, setSelectedUser] = useState<any>(null);
    //profile parner
    const [selectedPartner, setSelectedPartner] = useState<any>(null);

    //render click content from controller
    const renderContent = () => {
        switch (activePage) {
            //dashboard
            case "Dashboard":
                return <Dashboard />;
            //partner
            case "ListPartner":
                return <ListPartner onSelectProfile={(user) => {
                    setSelectedPartner(user);
                    setActivePage("ProfilePartner");
                }} />
            // profile partner
            case "ProfilePartner":
                return <ProfilePartner user={selectedPartner} />
            //newpartner
            //-->pending approval
            case "PendingApproval":
                return <PendingApproval />
            //-->refuse
            case "Refuse":
                return <Refuse onSelectProfile={(user) => {
                    setSelectedPartner(user);
                    setActivePage("ProfilePartner");
                }} />

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
            // profile customer
            case "ProfileCustomer":
                return <ProfileCustomer user={selectedUser} />;
        }
    }
    return (
        <div className="vh-100 d-flex flex-column ">
            {/* Header cố định */}
            <div className="sticky-top bg-white border-bottom shadow-sm">
                <Header
                    setShowOffcanvas={setShowOffcanvas}
                    setShowLaptop={setExpanded}
                    user={user}
                />
            </div>

            <Container fluid className="flex-grow-1 ">
                <Row className="h-100">
                    {/* Sidebar cố định chiều cao */}
                    {expanded && (
                        <Col
                            lg={2}
                            className="bg-dark text-light border-end border-secondary d-none d-lg-flex flex-column p-2"
                            style={{ height: "calc(100vh - 65px)", overflowY: "auto" }}
                        >
                            <Controller onSelectPage={setActivePage} />

                        </Col>
                    )}

                    {/* Content cuộn riêng */}
                    <Col
                        lg={expanded ? 10 : 12}
                        className="bg-primary p-4 overflow-auto "
                        style={{ height: "calc(100vh - 65px)" }}
                    >
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
        </div>)
}
{/* <Controller onSelectPage={setActivePage} /> */ }