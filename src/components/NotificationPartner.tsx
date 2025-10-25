import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
interface Props {
    user: any
}
export default function NotificationPartner({ user }: Props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);




    return (
        <>
            <Button variant="success" onClick={handleShow} className='fw-bold m-1'>
                Thông báo
            </Button>

            <Modal show={show} onHide={handleClose} animation={false} centered>
                <Modal.Header closeButton className='bg-header text-light'>
                    <Modal.Title>Thông Báo {user.nameStore}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <p className="text-secondary fw-bold fs-6 m-0 p-0">
                        Một khi đã xác nhận, bạn sẽ không thể hoàn tác. Vui lòng đảm bảo thông tin là chính xác.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Thoát
                    </Button>
                    <Button variant="success" onClick={handleClose}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </>)
}
