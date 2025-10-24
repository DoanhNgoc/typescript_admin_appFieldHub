interface Values {
    amount: number | string;
}

export default function FormatVND({ amount }: Values) {
    if (amount == null || amount === "") return null;

    // Chuyển về số và format
    const formatted = Number(amount).toLocaleString("vi-VN");

    return <span>{formatted}</span>;
}