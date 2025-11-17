import { useEffect, useMemo, useState } from "react";
import usePartnerBookings from "../../hooks/usePartnerBookings";
import { Button, Form, InputGroup, Spinner, Table } from "react-bootstrap";
import FormatVND from "../../components/FormatVND";
import UsevnStatusReference from "../../components/UsevnStatusReference";
import FormatTimeDate from "../../components/FormatTimeDate";
import UserNameAndPhone from "../../components/UserNameAndPhone";
import StarRatingAndContentRating from "../../components/StarRatingAndContentRating";
import SportOnField from "../../components/SportOnField";

interface Values {
  sportArray: any;
  nameStore: string
}

export default function ListBookingPartner({ sportArray, nameStore }: Values) {
  const [listFields, setListFields] = useState<any[]>([]);
  const [searchCode, setSearchCode] = useState("");
  useEffect(() => {
    // Gộp tất cả field từ các sport lại thành 1 mảng duy nhất
    const allFields = sportArray.flatMap((item: any) => item.fields || []);
    setListFields(allFields);
  }, [sportArray]);
  const { bookings, loading } = usePartnerBookings(listFields)

  //lọc danh sách theo tìm kiếm mã đơn
  const filteredBookings = useMemo(() => {
    if (!searchCode.trim()) return bookings;
    return bookings.filter((item: any) =>
      item.booking_code?.toLowerCase().includes(searchCode.toLowerCase())
    );
  }, [bookings, searchCode]);
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
                      placeholder="Tìm theo mã đơn..."
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)} // ✅ bắt sự kiện gõ
                    />
                    <Button
                      variant="light"
                      className="rounded-end border border-2"
                      onClick={() => setSearchCode("")} // ✅ nút clear nhanh
                    >
                      <i className="bi bi-x-circle"></i>
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
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((item: any, key: number) => (
                      <tr key={key}>
                        <td className="align-middle text-center">{key + 1}</td>
                        <UserNameAndPhone user_id={item.user_id?.id} />
                        <td className="align-middle text-center">
                          <FormatTimeDate timestamp={item.created_at} />
                        </td>
                        <td className="align-middle text-center">
                          <SportOnField fieldRef={item.field_id} />
                        </td>
                        <StarRatingAndContentRating booking_id={item.id} />
                        <td className="align-middle text-center">
                          <FormatVND amount={item.total_amount} />
                        </td>
                        <td className="align-middle text-center">
                          <UsevnStatusReference status={item.status_id} />
                        </td>
                        <td className="align-middle text-center">
                          {item.booking_code.slice(-4)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center text-secondary py-3">
                        Không tìm thấy mã đơn phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </>}

    </div>
  );
}
