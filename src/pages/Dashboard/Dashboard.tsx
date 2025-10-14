
export default function Dashboard() {
    return <div>
        <h3 className="fw-bold fs-1">Dashboard</h3>
        <div className="row">
            {/* customer monthly */}
            <div className="col-12 col-md-6 col-lg-3">
                <div className="m-2 p-3 border rounded-4 border-5 border-top-0 border-bottom-0 border-end-0 border-red bg-primary">
                    <div className="d-flex align-items-center justify-content-between">
                        {/*  */}
                        <div>

                            <div>{/* lable*/}
                                <p className="fw-bold fs-5 m-0 p-0">Khách Hàng (Monthly)</p>
                            </div>
                            <div> {/*growth index*/}
                                <p className="fw-bold fs-5 text-secondary m-0 mt-3 p-0">5% <i className="bi bi-arrow-up-circle-fill text-success"></i></p>
                            </div>
                        </div>
                        {/*  icon*/}
                        <div className="d-flex align-items-center">
                            <h1 className="m-0 p-0"><i className="bi bi-person-fill fs-1 fw-bold"></i></h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* customer annual */}
            <div className="col-12 col-md-6 col-lg-3">
                <div className="m-2 p-3 border border-blue rounded-4 border-5 border-top-0 border-bottom-0 border-end-0  bg-primary " >
                    <div className="d-flex align-items-center justify-content-between">
                        {/*  */}
                        <div>

                            <div>{/* lable*/}
                                <p className="fw-bold fs-5 m-0 p-0">Khách Hàng (Annual)</p>
                            </div>
                            <div> {/*growth index*/}
                                <p className="fw-bold fs-5 text-secondary m-0 mt-3 p-0">5% <i className="bi bi-arrow-down-circle-fill text-danger"></i></p>
                            </div>
                        </div>
                        {/*  icon*/}
                        <div className="d-flex align-items-center">
                            <h1 className="m-0 p-0"><i className="bi bi-person-fill fs-1 fw-bold"></i></h1>
                        </div>
                    </div>
                </div>
            </div>
            {/* parner */}
            <div className="col-12 col-md-6 col-lg-3">
                <div className="m-2 border-aqua p-3 border rounded-4 border-5 border-top-0 border-bottom-0 border-end-0  bg-primary">
                    <div className="d-flex align-items-center justify-content-between">
                        {/*  */}
                        <div>

                            <div>{/* lable*/}
                                <p className="fw-bold fs-5 m-0 p-0">Đối tác</p>
                            </div>
                            <div> {/*growth index*/}
                                <p className="fw-bold fs-5 text-secondary m-0 mt-3 p-0">120 <i className="bi bi-arrow-up-circle-fill text-success"></i></p>
                            </div>
                        </div>
                        {/*  icon*/}
                        <div className="d-flex align-items-center">
                            <h1 className="m-0 p-0"><i className="bi bi-person-fill fs-1 fw-bold"></i></h1>
                        </div>
                    </div>
                </div>
            </div>
            {/* support */}
            <div className="col-12 col-md-6 col-lg-3">
                <div className="m-2 border-yellow p-3 border rounded-4 border-5 border-top-0 border-bottom-0 border-end-0  bg-primary">
                    <div className="d-flex align-items-center justify-content-between">
                        {/*  */}
                        <div>

                            <div>{/* lable*/}
                                <p className="fw-bold fs-5 m-0 p-0">Hỗ trợ</p>
                            </div>
                            <div> {/*growth index*/}
                                <p className="fw-bold fs-5 text-secondary m-0 mt-3 p-0">15 <i className="bi bi-arrow-up-circle-fill text-success"></i></p>
                            </div>
                        </div>
                        {/*  icon*/}
                        <div className="d-flex align-items-center">
                            <h1 className="m-0 p-0"><i className="bi bi-person-fill fs-1 fw-bold"></i></h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}