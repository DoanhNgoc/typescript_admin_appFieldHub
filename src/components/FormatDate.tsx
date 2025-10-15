interface values {
    timestamp: any
}
export default function FormatDate({ timestamp }: values) {
    if (!timestamp?.seconds) return null;
    const d = new Date(timestamp.seconds * 1000);
    return d.toLocaleDateString("vi-VN"); // tự format dd/mm/yyyy   
}