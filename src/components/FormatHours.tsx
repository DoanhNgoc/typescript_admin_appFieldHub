interface values {
    timestamp: any
}
export default function FormatHours({ timestamp }: values) {
    if (!timestamp?.seconds) return null;
    const d = new Date(timestamp.seconds * 1000);
    return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
}