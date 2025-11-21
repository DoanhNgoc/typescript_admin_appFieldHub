// getData.ts
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useEffect, useState } from "react";
import { Alert, Button, FloatingLabel, Form, Modal, Table } from "react-bootstrap";
export default function Manager() {
    const [sports, setSports] = useState<any>([])
    // on show
    const [showAdd, setShowAdd] = useState(false);
    const [showDel, setShowDel] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [clickSport, setClickSport] = useState<any>({})
    const [newName, setNewName] = useState<string>("")
    const [error, setError] = useState(false);
    //onclick close show add sport
    const handleCloseAdd = () => {
        setShowAdd(false)
        setError(false)
        setNewName("")
    };
    const handleShowAdd = () => setShowAdd(true);

    //onclick close delete
    const handleCloseDel = () => {
        setShowDel(false)
        setError(false)
        setNewName("")

    };
    const handleShowDel = (sport: any) => {
        setShowDel(true)
        setClickSport(sport)
    };

    //onclick close edit
    const handleCloseEdit = () => {
        setShowEdit(false)
        setError(false)
    };
    const handleShowEdit = (sport: any) => {
        setNewName("")
        setShowEdit(true)
        setClickSport(sport)
        setNewName(clickSport.name)
    };


    const getSports = async () => {
        try {
            const sportCol = collection(db, "sports");
            const sportSnapshot = await getDocs(sportCol);

            const sportList = sportSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            return setSports(sportList)
        } catch (error) {
            console.log(error)
        }
    }
    //action add sport
    const addSport = async () => {
        try {

            if (newName === "") {
                setError(true)
            }
            else {
                setError(false)
                const sportCol = collection(db, "sports"); // collection "sports"
                await addDoc(sportCol, {
                    name: newName
                });
                handleCloseAdd()
            }


            // Cập nhật lại danh sách
            getSports();
        } catch (error) {
            console.error("Error adding sport:", error);
        }
    };

    //delete sport 
    const deleteSport = async (id: string) => {
        try {

            // Trỏ tới document cần xóa
            const sportDoc = doc(db, "sports", id);
            await deleteDoc(sportDoc);
            handleCloseDel()
            setClickSport({})
            // Cập nhật lại danh sách
            getSports();
        } catch (error) {
            console.error("Error deleting sport:", error);
        }
    };
    const editSport = async (id: string) => {
        try {
            if (newName === "") {
                setError(true)
            }
            else {
                const sportDoc = doc(db, "sports", id);
                await updateDoc(sportDoc, {
                    name: newName
                });
                handleCloseEdit()
            }


            getSports(); // reload danh sách
        } catch (error) {
            console.error("Error updating sport:", error);
        }
    };

    useEffect(() => { getSports() }, [])
    return <>
        <h3>Quản lý app</h3>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>stt</th>
                    <th>name</th>
                    <th>action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colSpan={3}><Button className="w-100" variant="secondary" onClick={() => handleShowAdd()}>Add Sport</Button></td>

                </tr>
                {sports.map(
                    (item: any, key: number) => <tr key={key}>
                        <td>{key + 1}</td>
                        <td className="col-10">{item.name}</td>
                        <td>
                            <div className="d-flex justify-content-center">
                                <Button variant="success" className="mx-1" onClick={() => {
                                    handleShowEdit(item)
                                }}>Edit</Button>
                                <Button variant="info" className="mx-1" onClick={() => {
                                    handleShowDel(item)

                                }}>Delete</Button>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
        <pre>
            {JSON.stringify(sports, null, 2)}
        </pre>
        {/* modal add sports */}
        <Modal show={showAdd} onHide={handleCloseAdd}>
            <Modal.Header closeButton>
                <Modal.Title>Add sport</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FloatingLabel
                    controlId="floatingInput"
                    label="New name Sports"
                    className="mb-3"
                >
                    <Form.Control type="text" placeholder="text name" onChange={(e) => setNewName(e.target.value)} />
                </FloatingLabel>
                {error !== true || <Alert variant="danger">
                    no name value sport
                </Alert>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAdd}>
                    Close
                </Button>
                <Button variant="info" onClick={addSport}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
        {/* modal delete */}
        <Modal show={showDel} onHide={handleCloseDel}>
            <Modal.Header closeButton>
                <Modal.Title>Delete sport</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="fw-bold">confirm delete {clickSport.name}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDel}>
                    Close
                </Button>
                <Button variant="info" onClick={() => { deleteSport(clickSport.id) }}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
        {/* modal edit */}
        <Modal show={showEdit} onHide={handleCloseEdit}>
            <Modal.Header closeButton>
                <Modal.Title>Edit sport</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FloatingLabel
                    controlId="floatingInput"
                    label="New name Sports"
                    className="mb-3"
                >
                    <Form.Control type="text" placeholder="text name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </FloatingLabel>
                {error !== true || <Alert variant="danger">
                    no name value sport
                </Alert>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEdit}>
                    Close
                </Button>
                <Button variant="info" onClick={() => { editSport(clickSport.id) }}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}
