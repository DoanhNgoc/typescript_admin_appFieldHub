import { useEffect, useState } from "react";
import usePartnerBookings from "../../hooks/usePartnerBookings";
import { Button, Form, InputGroup, Spinner, Table } from "react-bootstrap";
import FormatVND from "../../components/FormatVND";
import UsevnStatusReference from "../../components/UsevnStatusReference";
import FormatTimeDate from "../../components/FormatTimeDate";
import UserNameAndPhone from "../../components/UserNameAndPhone";
import StarRatingAndContentRating from "../../components/StarRatingAndContentRating";
import SportNameReference from "../../components/SportNameReference";

interface Values {
  sportArray: any;
  nameStore: string
}

export default function ListBookingPartner({ sportArray, nameStore }: Values) {
  const [listFields, setListFields] = useState<any[]>([]);

  useEffect(() => {
    // Gộp tất cả field từ các sport lại thành 1 mảng duy nhất
    const allFields = sportArray.flatMap((item: any) => item.fields || []);
    setListFields(allFields);
  }, [sportArray]);
  const { bookings, loading } = usePartnerBookings(listFields)

  return (
    <div>
      {loading ?
        <Spinner animation="border" variant="info" />
        :
        <>
          <h3 className="fw-bold fs-3">Đơn Đặt {nameStore !== "" ? nameStore : <span className="text-small text-secondary">Chưa xác định</span>}</h3>
          <div className="my-shadow border rounded-4 mt-4">
            <div className="m-2 px-2 mt-3">
              <div className="row p-0 m-0">
                <div className="col-1 col-md-5 m-0 p-0">
                  <p className="fs-5 fw-bold d-none d-md-block">Danh sách đơn</p>
                </div>
                <div className="col-11 col-md-7 m-0 p-0 fs-5">
                  <InputGroup>
                    <Form.Control
                      placeholder="Tìm theo tên hoặc số điện thoại..."

                    />
                    <Button variant="light" className="rounded-end border border-2">
                      <i className="bi bi-search"></i>
                    </Button>
                  </InputGroup>
                </div>
              </div>
            </div>

            <div className="m-0 p-0">
              <Table bordered variant="secondary" hover>
                <thead>
                  <tr>
                    <th className="align-middle text-center">STT</th>
                    <th className="align-middle text-center">Khách hàng</th>
                    <th className="align-middle text-center">SĐT</th>
                    <th className="align-middle text-center">Ngày đặt</th>
                    <th className="align-middle text-center">Mô hình</th>
                    <th className="align-middle text-center">Đánh giá</th>
                    <th className="align-middle text-center">Nội dung đánh giá</th>
                    <th className="align-middle text-center">Tổng tiền</th>
                    <th className="align-middle text-center">Trạng Thái</th>
                    <th className="align-middle text-center">Mã đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((item: any, key: number) => <tr key={key}>
                    <td className="align-middle text-center">{key + 1}</td>
                    <UserNameAndPhone user_id={item.user_id?.id} />
                    <td className="align-middle text-center">{<FormatTimeDate timestamp={item.created_at} />}</td>
                    <SportNameReference sport_id={item.sport_id?.id} />
                    <StarRatingAndContentRating booking_id={item.id} />
                    <td className="align-middle text-center"><FormatVND amount={item.price} /></td>
                    <td className="align-middle text-center"><UsevnStatusReference status={item.status_id} /></td>
                    <td className="align-middle text-center">{item.booking_code.slice(-4)}</td>
                  </tr>)}
                </tbody>
              </Table>
            </div>
          </div>
        </>}
      <h3>booking:</h3>
      <pre>{JSON.stringify(bookings, null, 2)}</pre>

      <h3>danh sach san</h3>
      <pre>{JSON.stringify(listFields, null, 2)}</pre>
    </div>
  );
}
