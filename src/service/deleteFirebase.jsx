import { doc,deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { storage,db,auth } from "./firebaseConfig"; 

export const deleteData = async (collection, docId) => {
  const userId = auth.currentUser.uid;

  try {
    await deleteDoc(doc(db,"stores",userId, collection, docId));
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collection}:`, error);
    throw error;
  }
};

export const deleteImageFromFirebase = async (folder, docId,collection) => {
  const userId = auth.currentUser.uid;
  try {
    const storageRef = ref(storage, `${userId}/${collection}/${folder}/${docId}.jpg`);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};