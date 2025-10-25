import { Button, Form, FloatingLabel, Spinner } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { useState, type FormEvent } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
// import { auth } from "../../firebase/config";
import { getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
interface value {
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}
export default function Login({ setShow }: value) {

    const { login, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassowrd] = useState("");
    const db = getFirestore();
    const navigate = useNavigate();
    if (loading) {
        return <div className="">
            <Spinner animation="border" variant="info" />
        </div>
    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            setShow(true);
            return;
        }
        try {
            const userCredential = await login(email.trim(), password);
            const user = userCredential.user;

            if (user) {
                const q = query(collection(db, "users"), where("email", "==", user.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    const roleRef = userData.role_id;

                    if (roleRef) {
                        const roleDoc = await getDoc(roleRef);

                        if (roleDoc.exists()) {
                            const roleData = roleDoc.data() as { name?: string };
                            if (roleData?.name === "admin") {
                                const cleanUser = { ...userData, role_id: roleRef.path };
                                navigate("/MainLayout", { state: { user: cleanUser } });
                            } else {
                                setShow(true);
                            }
                        }
                    }
                }
            }
        } catch (error: any) {
            console.error("🔥 Lỗi đăng nhập:", error.code, error.message);

            switch (error.code) {
                case "auth/invalid-email":
                    alert("Email không hợp lệ!");
                    break;
                case "auth/user-not-found":
                    alert("Email không tồn tại trong hệ thống!");
                    break;
                case "auth/wrong-password":
                    alert("Sai mật khẩu! Vui lòng thử lại.");
                    break;
                case "auth/invalid-credential":
                    alert("Email hoặc mật khẩu không đúng!");
                    break;
                case "auth/network-request-failed":
                    alert("Không thể kết nối mạng. Vui lòng kiểm tra Internet.");
                    break;
                default:
                    alert("Đăng nhập thất bại! Vui lòng thử lại sau.");
            }

            setShow(true);
        }
    };
    return <div className="bg-dark custom-width rounded position-relative " aria-live="polite"
        aria-atomic="true">


        <Form
            onSubmit={handleSubmit}
            className="p-4 border rounded shadow bg-white"
            style={{ minWidth: 350 }}
        >
            <h3 className="text-center mb-4">Đăng nhập</h3>
            <FloatingLabel
                controlId="floatingInput"
                label="Email"
                className="m-3"
            >
                <Form.Control type="email" placeholder="abc123@gmail.com" onChange={(e) => { setEmail(e.target.value) }} />
            </FloatingLabel>
            <FloatingLabel
                controlId="floatingPassword"
                className="m-3"
                label="Password">

                <Form.Control type="password" placeholder="Password" onChange={(e) => { setPassowrd(e.target.value) }} />
            </FloatingLabel>
            <div className="d-flex justify-content-between m-3">
                <Button variant='info' type="submit" className='text-light' >Login</Button>
            </div>

        </Form>

    </div>
}