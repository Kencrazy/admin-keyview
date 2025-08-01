import { auth,db,storage } from "./firebaseConfig";
import { deleteDoc, doc, collection, query, setDoc, updateDoc, getDoc, getDocs, arrayRemove, arrayUnion, where } from "firebase/firestore";
import { ref, getDownloadURL, getMetadata } from "firebase/storage";

export const handleGetData = async () => {
    try{
        const userId = localStorage.getItem("userId");
        const userRef = doc(db, "stores", userId);
        const ordersRef = collection(userRef, "orders");
        const productsRef = collection(userRef, "products");
        const docSnap = await getDoc(userRef);
        const [ordersSnap, productsSnap] = await Promise.all([
            getDocs(ordersRef),
            getDocs(productsRef),
        ]);

        const orders = ordersSnap.empty ? [] : ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const products = productsSnap.empty ? [] : productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return {
            user: docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null,
            orders,
            products
        };
    }catch (error) {
        console.error("Error getting data: ", error);
    }
}

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