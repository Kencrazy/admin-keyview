import { auth,db,storage } from "./firebaseConfig";
import {doc, updateDoc, getDoc, setDoc, deleteDoc} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export const updateImageToFirebase = async (file, imageName, collectionRef = "", itemId = "") => {
  const userId = auth.currentUser.uid

  if (!file || !imageName) {
    console.error("Missing required fields (file, image name)");
    return;
  }

  try {
    const path = collectionRef && itemId
      ? `${userId}/${collectionRef}/${itemId}/${imageName}`
      : `${userId}/meta/${imageName}`;

    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (e) {
    console.error("Error updating image", e);
    throw e;
  }
};


export const updateData = async (collectionRef = "", newData = {}, itemId = "") => {
  const userId = auth.currentUser.uid
  
  if (!userId || !newData || typeof newData !== "object") {
    console.error("Invalid input to updateData");
    return;
  }

  try {
    const docRef = collectionRef && itemId
      ? doc(db,"stores", userId, collectionRef, itemId)
      : doc(db, "stores", userId);

    await updateDoc(docRef, newData);

    console.log("Data updated successfully");
  } catch (e) {
    console.error("Error updating data", e);
    throw e;
  }
};