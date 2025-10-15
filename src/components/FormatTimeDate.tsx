interface Values {
    timestamp: any;
}

export default function FormatTimeDate({ timestamp }: Values) {
    if (!timestamp?.seconds) return null;

    const d = new Date(timestamp.seconds * 1000);

    // Format: dd/mm/yyyy hh:mm:ss
    const date = d.toLocaleDateString("vi-VN");
    const time = d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return <>{`${time} ${date}`}</>;
}
