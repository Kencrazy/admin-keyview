import { auth,db,storage } from "./firebaseConfig";
import {doc, updateDoc, getDoc, setDoc, deleteDoc} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export const updateImageToFirebase = async (input, imageName, collectionRef = "", itemId = "") => {
  const userId = auth.currentUser.uid;

  if (!input || !imageName) {
    console.error("Missing required fields (input, image name)");
    return null;
  }

  try {
    const normalizedImageName = imageName.endsWith(".jpg") ? imageName : `${imageName}.jpg`;

    const path = collectionRef && itemId
      ? `${userId}/${collectionRef}/${itemId}/${normalizedImageName}`
      : `${userId}/meta/${normalizedImageName}`;

    let blob;
    if (typeof input === "string" && input.startsWith("data:image")) {
      const img = new Image();
      img.src = input;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9)
      );
    } else if (input instanceof File || input instanceof Blob) {
      if (input.type.startsWith("image/")) {
        const img = new Image();
        img.src = URL.createObjectURL(input);
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        blob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9)
        );
        URL.revokeObjectURL(img.src);
      } else {
        throw new Error("Input file is not an image");
      }
    } else {
      throw new Error("Invalid input: must be a File, Blob, or base64 data URL");
    }

    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (e) {
    console.error("Error updating image to Firebase:", e);
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

    await setDoc(docRef, newData, {merge:true});

    console.log("Data updated successfully");
  } catch (e) {
    console.error("Error updating data", e);
    throw e;
  }
};