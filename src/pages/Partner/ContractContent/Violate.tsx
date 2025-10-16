import { useState, useEffect } from "react";
import { Button, Spinner, Alert } from "react-bootstrap";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
} from "firebase/firestore";
import mammoth from "mammoth";
import { db } from "../../../firebase/config";

export default function Violate() {
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [file, setFile] = useState<File | null>(null);
    const [previewContent, setPreviewContent] = useState<string>("");
    const [showButtons, setShowButtons] = useState<boolean>(false);
    const [lastDate, setLastDate] = useState<string>("");
    const [error, setError] = useState<string>("");

    // 🔹 Lấy policy violate mới nhất
    const fetchLatestPolicy = async () => {
        try {
            const q = query(collection(db, "policies"), where("type", "==", "violate"));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const dataList = snapshot.docs.map((doc) => doc.data());
                const latest = dataList.sort(
                    (a, b) => (b.uploadedAt?.seconds || 0) - (a.uploadedAt?.seconds || 0)
                )[0];
                setContent(latest.htmlContent || "<p>Không có nội dung.</p>");
                if (latest.uploadedAt?.seconds)
                    setLastDate(
                        new Date(latest.uploadedAt.seconds * 1000).toLocaleString("vi-VN")
                    );
            } else {
                setContent("<p>Chưa có chính sách nào được tải lên.</p>");
            }
        } catch (err: any) {
            console.error("❌ Lỗi khi lấy policy:", err);
            setError("Không thể tải chính sách, thử lại sau!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestPolicy();
    }, []);

    // 🔹 Khi chọn file mới
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        setError("");
        setFile(selected);
        setShowButtons(true);

        const buffer = await selected.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
        setPreviewContent(result.value);
    };

    // 🔹 Khi ấn Save
    const handleSave = async () => {
        if (!file) return;
        setLoading(true);
        setError("");

        try {
            const now = new Date();
            const pad = (n: number) => n.toString().padStart(2, "0");
            const formatted = `${now.getFullYear()}${pad(
                now.getMonth() + 1
            )}${pad(now.getDate())}_${pad(now.getHours())}${pad(
                now.getMinutes()
            )}${pad(now.getSeconds())}`;
            const fileName = `violate_${formatted}.docx`;

            await addDoc(collection(db, "policies"), {
                type: "violate",
                fileName,
                htmlContent: previewContent,
                uploadedAt: serverTimestamp(),
            });

            // 🔥 Sau khi lưu xong, load lại bản mới nhất
            await fetchLatestPolicy();

            setPreviewContent("");
            setShowButtons(false);
            setFile(null);
        } catch (err: any) {
            console.error("❌ Lỗi khi lưu:", err);
            setError("Lưu thất bại! Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Khi ấn Cancel
    const handleCancel = () => {
        setPreviewContent("");
        setShowButtons(false);
        setFile(null);
    };

    return (
        <div>
            <h3 className="fs-3 fw-bold">
                Chính sách của <span className="text-info">FieldHub</span>
            </h3>

            <div className="my-shadow rounded-4 pb-2">
                <div className="m-0 p-0">
                    <div className="m-0 p-3 py-2 rounded-top-4 bg-header text-light d-flex justify-content-between px-3 align-items-center">
                        <p className="fw-bold fs-4 align-items-center m-0 p-0">
                            Văn bản quy phạm
                        </p>

                        {!showButtons ? (
                            <div>
                                <input
                                    type="file"
                                    id="file-input"
                                    accept=".doc,.docx"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                <Button
                                    variant="success"
                                    className="py-0"
                                    onClick={() =>
                                        document.getElementById("file-input")?.click()
                                    }
                                >
                                    Add file
                                </Button>
                            </div>
                        ) : (
                            <div className="d-flex gap-2">
                                <Button variant="primary" className="py-0" onClick={handleSave}>
                                    Save
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="py-0"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="info" />
                        </div>
                    ) : (
                        <div
                            className="content mb-3 p-3"
                            dangerouslySetInnerHTML={{
                                __html: previewContent || content,
                            }}
                        />
                    )}

                    {error && <Alert variant="danger" className="mx-3">{error}</Alert>}

                    {lastDate && (
                        <div className="text-end pe-4 pb-2 text-secondary fst-italic">
                            Lần lưu gần nhất: {lastDate}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
