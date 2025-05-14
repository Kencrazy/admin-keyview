import { db,storage } from "./firebaseConfig";
import { doc,getDoc,collection,getDocs } from "firebase/firestore";
import { ref,getDownloadURL } from "firebase/storage";

export const readUserMetadata = async () => {
    try {
        const userId = localStorage.getItem("userId");
        const userRef = doc(db, "stores", userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error reading user metadata: ", error);
    }
};

export const readImageFirebase = async (imageUrl) => {
    try {
        const imageRef = ref(storage, imageUrl);
        const url = await getDownloadURL(imageRef);
        return url;
    } catch (error) {
        console.error("Error reading image from Firebase: ", error);
    }
}