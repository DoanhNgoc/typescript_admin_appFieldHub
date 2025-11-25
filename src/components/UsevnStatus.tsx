interface value {
    status: string
}
export default function UsevnStatus({ status }: value) {
    if (!status)
        return
    else if (status === "pending")
        return "Chờ xác nhận"
    else if (status === "approved")
        return "Xác nhận"
    else if (status === "canceled")
        return "Hủy"
    else if (status === "paid")
        return "Đã thanh toán"
    else if (status === "unpaid")
        return "Chưa thanh toán"
    else if (status === "completed")
        return "Hoàn thành"
    else if (status === "using")
        return "Đang sữ dụng"
    else
        return "trạng thái không cập nhật"
}