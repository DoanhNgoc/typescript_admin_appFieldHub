import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


interface Props {
    user: any
}
export default function CancelOfContract({ user }: Props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    console.log(user)
    return (
        <>
            <Button variant="danger" onClick={handleShow} className='fw-bold m-1'>
                Hủy hợp đồng
            </Button>

            <Modal show={show} onHide={handleClose} animation={false} centered>
                <Modal.Header closeButton className='bg-header text-light'>
                    <Modal.Title>Hủy hợp tác với {user.nameStore}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Thoát
                    </Button>
                    <Button variant="success" onClick={handleClose}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
