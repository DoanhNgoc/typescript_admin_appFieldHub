import { Spinner } from "react-bootstrap"
import { useReviewByBookingId } from "../hooks/useReviewByBookingId";
import RenderStars from "./RenderStars";

interface values {
    booking_id: string
}
export default function StarRatingAndContentRating({ booking_id }: values) {
    const { review, loading } = useReviewByBookingId(booking_id);
    console.log("booking_id: ", booking_id)
    console.log(review)
    return <>
        {loading ? <>
            <td className="align-middle text-center"><Spinner animation="grow" variant="info" /></td>
            <td className="align-middle text-center"><Spinner animation="grow" variant="info" /></td>
        </>
            :
            <>
                <td className="align-middle text-center ">{review !== null && review.rating !== null ? <RenderStars rating={review.rating} /> : <span className="text-small text-secondary">Không có đánh giá</span>}</td>
                <td className="align-middle ">{review !== null && review.comment !== "" ? review.comment : <span className="text-small text-secondary">không có nội dung đánh giá</span>}</td>
            </>}

    </>
}