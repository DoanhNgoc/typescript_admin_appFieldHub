import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Spinner } from "react-bootstrap";
import FormatHours from "./FormatHours";
``
interface FieldPriceInfoProps {
    field: any; // field lấy từ Firestore
    keyNumber: number;
}


export default function FieldPriceInfo({ field, keyNumber }: FieldPriceInfoProps) {
    const [prices, setPrices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!field?.id) return;

        (async () => {
            setLoading(true);
            try {
                const fieldRef = doc(db, "fields", field.id);

                // 🔍 Lấy tất cả bảng giá của sân
                const pricesSnap = await getDocs(
                    query(collection(db, "prices"), where("field_id", "==", fieldRef))
                );

                const pricesData = pricesSnap.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                }));

                setPrices(pricesData);
            } catch (err) {
                console.error("Lỗi khi load giá:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [field]);
    if (loading) return <td colSpan={8} className="text-center">
        <Spinner animation="grow" variant="info" />
    </td>;



    return < >
        <td className="text-center align-middle">{keyNumber + 1}</td>
        <td className="text-center align-middle">{field.name}</td>
        <td className="text-center align-middle">{field.address}</td>
        <td className="text-center align-middle"><FormatHours timestamp={field.open_time} /></td>
        <td className="text-center align-middle"><FormatHours timestamp={field.close_time} /></td>
        <td className="text-center align-middle">
            {prices.length > 0 ? (
                <span>
                    {Number(prices[0].price_amount).toLocaleString("vi-VN")} vnđ
                    ({prices[0].start_time}-{prices[0].end_time})
                </span>
            ) : (
                <span className="text-small text-secondary">chưa xác định</span>
            )}
        </td>

        <td className="text-center align-middle">
            {prices.length > 0 ? (
                <span>
                    {Number(
                        prices[0].price_amount +
                        (prices[0].price_amount * prices[0].percentage_price_change) / 100
                    ).toLocaleString("vi-VN")} vnđ
                </span>
            ) : (
                <span className="text-small text-secondary">chưa xác định</span>
            )}
        </td>

    </>;
}
