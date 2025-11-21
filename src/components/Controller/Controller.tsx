import { Accordion } from "react-bootstrap";
type ControllerManagerProps = {
    onSelectPage: (page: string) => void;
};

export default function Controller({ onSelectPage }: ControllerManagerProps) {

    return <ul className="list-unstyled text-primary">


        <Accordion defaultActiveKey="0" className="bg-dark  w-100">
            {/* dashboard */}
            <li className="py-2 text-light fs-5 px-3 text-primary" onClick={() => { onSelectPage("Dashboard") }}>
                <i className="bi bi-columns-gap me-2 ms-1 text-primary"></i><span className="text-primary">Dashboard</span>
            </li>
            {/* partner */}
            <Accordion.Item eventKey="0" className="bg-dark text-light border-0" >
                <Accordion.Header className="bg-dark text-light fs-5 ">
                    <i className="bi bi-person-circle me-2"></i>Đối tác
                </Accordion.Header>
                {/* body */}
                <Accordion.Body className="bg-dark text-light">
                    {/* list */}
                    <div className="position-relative ps-3">
                        {/* len left */}
                        <div className="position-absolute start-0 top-0 h-100 border-start border-2 border-secondary"></div>
                        {/* list controller */}
                        <ul className="list-unstyled">
                            <Accordion defaultActiveKey="1" className="bg-dark text-primary w-100">
                                <li className="ms-1 py-3 m-0 fs-5 " onClick={() => { onSelectPage("ListPartner") }}>
                                    Danh sách đối tác
                                </li>
                                <Accordion.Item eventKey="0" className="bg-dark text-light border-0" >

                                    <Accordion.Header className="bg-dark text-light" >
                                        <i className="bi bi-person-fill-add me-2"></i>đối tác mới
                                    </Accordion.Header>

                                    <Accordion.Body className="bg-dark text-light">
                                        {/* list */}
                                        <div className="position-relative ps-2">
                                            {/* len left */}
                                            <div className="position-absolute start-0 top-0 h-100 border-start border-2 border-secondary"></div>
                                            <ul className="list-unstyled text-primary ">

                                                <li className="ms-1 py-3 m-0 fs-5" onClick={() => { onSelectPage("PendingApproval") }}>
                                                    Chờ phê duyệt
                                                </li>

                                                <li className="ms-1 py-3 m-0 fs-5" onClick={() => { onSelectPage("Refuse") }}>
                                                    Từ chối
                                                </li>
                                            </ul>
                                        </div>
                                    </Accordion.Body>

                                    <li className="ms-1 py-3 m-0 fs-5 text-primary" onClick={() => { onSelectPage("Violate") }}>
                                        Vi phạm
                                    </li>

                                    <li className="ms-1 py-3 m-0 fs-5 text-primary" onClick={() => { onSelectPage("InforContract") }}>
                                        Thông tin hợp đồng
                                    </li>
                                </Accordion.Item>

                            </Accordion>



                        </ul>
                    </div>
                </Accordion.Body>
            </Accordion.Item>

            {/* customer */}
            <Accordion.Item eventKey="2" className="bg-dark text-light border-0" >
                <Accordion.Header className="bg-dark text-light" >
                    <i className="bi bi-people-fill me-2"></i>Khách hàng
                </Accordion.Header>
                <Accordion.Body className="bg-dark text-light">
                    {/* list */}
                    <div className="position-relative ps-2">
                        {/* len left */}
                        <div className="position-absolute start-0 top-0 h-100 border-start border-2 border-secondary"></div>
                        <ul className="list-unstyled text-primary">
                            <li className="ms-1 py-3 m-0 fs-5" onClick={() => { onSelectPage("ListCustomer") }}>
                                Danh sách khách hàng
                            </li>
                            <li className="ms-1 py-3 m-0 fs-5" onClick={() => { onSelectPage("CustomerService") }}>
                                Chăm sóc khách hàng
                            </li>
                        </ul>
                    </div>
                </Accordion.Body>
            </Accordion.Item>

            {/* manager sport */}
            <li className="py-2 text-light fs-5 px-3 text-primary" onClick={() => { onSelectPage("Manager") }}>
                <i className="bi bi-kanban me-2 ms-1 text-primary"></i><span className="text-primary">quản lý app</span>
            </li>
        </Accordion>

    </ul >
}