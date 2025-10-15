import { getDoc, type DocumentReference, type DocumentData } from "firebase/firestore";

export async function getDocDataFromRef(ref: any) {
    if (!ref || !ref.path) return null;

    const docSnap = await getDoc(ref as DocumentReference<DocumentData>);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}
