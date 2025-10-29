import { useEffect, useState } from "react";
import usePartnerBookings from "../../hooks/usePartnerBookings";

interface Values {
  sportArray: any;
}

export default function ListBookingPartner({ sportArray }: Values) {
  const [listFields, setListFields] = useState<any[]>([]);

  useEffect(() => {
    // Gộp tất cả field từ các sport lại thành 1 mảng duy nhất
    const allFields = sportArray.flatMap((item: any) => item.fields || []);
    setListFields(allFields);
  }, [sportArray]);
  const {bookings, loading}= usePartnerBookings(listFields)
  
  return (
    <div>
      <h3>booking:</h3>
      <pre>{JSON.stringify(bookings, null, 2)}</pre>
      
      <h3>danh sach san</h3>
      <pre>{JSON.stringify(listFields, null ,2)}</pre>
    </div>
  );
}
