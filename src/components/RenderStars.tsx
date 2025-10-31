
interface values {
    rating: number
}

export default function RenderStars({ rating }: values) {
    const filledStars = Math.max(0, Math.min(5, rating));
    const emptyStars = 5 - filledStars;

    const stars = [];

    for (let i = 0; i < filledStars; i++) {
        stars.push(<i key={`filled-${i}`} className="bi bi-star-fill me-1 fs-5 text-warning"></i>);
    }

    for (let i = 0; i < emptyStars; i++) {
        stars.push(<i key={`empty-${i}`} className="bi bi-star me-1 fs-5 text-warning"></i>);
    }

    return <span className="d-block">{stars}</span>;
}

