// src/services/firebaseService.js
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  where,
  setDoc,
  getDoc,
  increment,
  deleteDoc
} from "firebase/firestore";
import { db } from "../auth/firebaseConfig";

export const fetchServices = async () => {
  console.log("fetching services");
  const querySnapshot = await getDocs(collection(db, "services"));
  const servicesList = querySnapshot.docs.map((doc) => ({
    value: doc.id,
    label: doc.data().label,
  }));
  return servicesList;
};
export const updateListAvailability = async (userId, services) => {
  console.log("updateListAvailability", userId, services);
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, { services });
};

export const updateListData = async (userId, data) => {
  console.log("updateListData", userId, data);
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, data);
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

export const getListings = async (List) => {
  console.log("getListings", List);
  // const getCurrentPosition = () => {
  //   return new Promise((resolve, reject) => {
  //     navigator.geolocation.getCurrentPosition(resolve, reject);
  //   });
  // };

  // const position = await getCurrentPosition();
  // const userLat = position.coords.latitude;
  // const userLon = position.coords.longitude;

  let usersQuery = query(
    collection(db, "items")
    // where("isList", "==", true),
    // orderBy("distance", "asc")
  );
  if (List) {
    // usersQuery = query(usersQuery, where("id", "!=", List.id));
  }

  const querySnapshot = await getDocs(usersQuery);
  const listings = querySnapshot.docs.map((doc) => {
    const listingData = doc.data();
    // const listLocation = listingData.position?.geopoint;
    // const distance = calculateDistance(
    //   userLat,
    //   userLon,
    //   listLocation._lat,
    //   listLocation._long
    // );

    return {
      id: doc.id,
      ...listingData,
      distance: 0, //distance.toFixed(2),
    };
  });
  // console.log(listings);

  return listings;
};
export const getThreadId = async (currentUserId, recipientUserId) => {
  console.log("getThreadId", currentUserId, recipientUserId);
  console.log(
    "currentUserId",
    currentUserId,
    "recipientUserId",
    recipientUserId
  );
  try {
    // Query to check if a thread exists between the current user and the recipient
    const inboxRef = collection(db, "inbox");
    const q = query(inboxRef, where("users", "array-contains", currentUserId));

    const querySnapshot = await getDocs(q);
    let threadId = null;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Check if the document has both participants
      if (data.users.includes(recipientUserId)) {
        threadId = doc.id;
      }
    });

    return threadId;
  } catch (error) {
    console.error("Error checking for existing thread:", error);
    return null;
  }
};
export const addMessageToFirestore = async (message) => {
  console.log("addMessageToFirestore", message);
  try {
    let threadId = await getThreadId(
      message?.sender?.id,
      message?.receiver?.id
    );

    let threadRef = null;
    const messageWithReadStatus = {
      ...message,
      read: {
        [message.sender.id]: true, // Sender has read the message
        [message.receiver.id]: false, // Receiver has not read the message
      },
      unreadCounts: {
        [message.receiver.id]: increment(1),
      },
    };

    if (threadId) {
      // Thread exists, add the message to the existing thread
      threadRef = doc(db, "inbox", threadId);
      await addDoc(collection(threadRef, "messages"), {
        ...messageWithReadStatus,
        threadId,
      });
      await updateDoc(threadRef, { ...messageWithReadStatus, threadId });
    } else {
      // Thread does not exist, create a new thread
      threadId = Date.now().toString();
      threadRef = doc(collection(db, "inbox"), threadId);
      await setDoc(
        threadRef,
        { ...messageWithReadStatus, threadId },
        { merge: true }
      );
      await addDoc(collection(threadRef, "messages"), {
        ...messageWithReadStatus,
        threadId,
      });
    }
  } catch (error) {
    console.error("Error adding message to Firestore:", error);
  }
};

export const getInboxMessages = (currentUser, callback) => {
  console.log("getInboxMessages", currentUser);
  const q = query(
    collection(db, "inbox"),
    where("users", "array-contains", currentUser?.uid)
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

export const updateMessageInFirestore = async (threadId, messageId, data) => {
  console.log("updateMessageInFirestore", threadId, messageId, data);
  const messageDocRef = doc(db, "inbox", threadId, "messages", messageId);
  await updateDoc(messageDocRef, data);
};

export const getAllMessages = (currentUserUid, recipientUserUid, callback) => {
  console.log("getAllMessages", currentUserUid, recipientUserUid);
  const q = query(
    collection(db, "inbox"),
    where("users", "array-contains", currentUserUid)
  );

  // Listen for real-time updates
  return onSnapshot(q, (snapshot) => {
    let threadId = null;
    try {
      // Find the thread that contains both users
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.users.includes(recipientUserUid)) {
          threadId = doc.id;
        }
      });

      if (threadId) {
        const messagesQuery = query(
          collection(db, "inbox", threadId, "messages"),
          orderBy("timestamp", "asc")
        );

        return onSnapshot(messagesQuery, (messagesSnapshot) => {
          const messages = messagesSnapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              id: doc.id,
            };
          });
          callback(messages);
        });
      } else {
        // If no thread is found, return an empty array
        callback([]);
      }
    } catch (error) {
    } finally {
      onInboxOrChatOpen(threadId, currentUserUid, recipientUserUid);
    }
  });
};

export const markLatestMessageAsRead = async (threadId, userId) => {
  console.log("markLatestMessageAsRead", threadId, userId);
  const threadRef = doc(db, "inbox", threadId);
  await updateDoc(threadRef, {
    [`read.${userId}`]: true,
  });
};

// Call this function when the user opens the inbox or chat
export const onInboxOrChatOpen = async (threadId, currentUserId) => {
  console.log("onInboxOrChatOpen", threadId, currentUserId);
  await markLatestMessageAsRead(threadId, currentUserId);
  await resetUnreadCount(threadId, currentUserId);
};

const resetUnreadCount = async (threadId, userId) => {
  console.log("resetUnreadCount", threadId, userId);
  const threadRef = doc(db, "inbox", threadId);
  await updateDoc(threadRef, {
    [`unreadCounts.${userId}`]: 0,
  });
};

export const getUnreadCount = async (threadId, userId) => {
  console.log("getUnreadCount", threadId, userId);
  const threadRef = doc(db, "inbox", threadId);
  const threadDoc = await getDoc(threadRef);
  if (threadDoc.exists()) {
    const data = threadDoc.data();
    return data.unreadCounts?.[userId] || 0;
  }
  return 0;
};


export const addtoFavorite = async (userId, data) => {
  console.log("addtoFavorite", userId, data);
  //add to subcollection of users collection
  const userDocRef = doc(db, "users", userId);
  const favoritesCollectionRef = collection(userDocRef, 'favorites');
  const q = query(favoritesCollectionRef, where("id", "==", data.id));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    await addDoc(favoritesCollectionRef, data);
  } else {
    await deleteDoc(querySnapshot.docs[0].ref);
  }
}
export const itemSubscribe = async (itemid, data) => {
  console.log("itemSubscribe", itemid, data);
  //add to subcollection of users collection
  const itemDocRef = doc(db, "items", itemid);
  const itemsCollectionRef = collection(itemDocRef, 'subscribers');
  const q = query(itemsCollectionRef, where("id", "==", data.id));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    await addDoc(itemsCollectionRef, data);
    await addItemSubscribedtoUser(data.id, itemid);
  } else {
    await deleteDoc(querySnapshot.docs[0].ref);
    await removeItemSubscribedtoUser(data.id, itemid);
  }
}

const addItemSubscribedtoUser = async (userid, itemid) => {
  console.log("addItemSubscribedtoUser", userid, itemid);
  const userDocRef = doc(db, "users", userid);
  const subscribedRef = collection(userDocRef, 'subscribed');
  const q = query(subscribedRef, where("id", "==", itemid));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    await addDoc(subscribedRef, { id: itemid });
  }
}

export const removeItemSubscribedtoUser = async (userid, itemid) => {
  console.log("removeItemSubscribedtoUser", userid, itemid);
  const userDocRef = doc(db, "users", userid);
  const subscribedRef = collection(userDocRef, 'subscribed');
  const q = query(subscribedRef, where("id", "==", itemid));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    await deleteDoc(querySnapshot.docs[0].ref);
  }


  const itemDocRef = doc(db, "items", itemid);
  const subscribersRef = collection(itemDocRef, 'subscribers');
  const q1 = query(subscribersRef, where("id", "==", userid));
  const querySnapshot1 = await getDocs(q1);
  if (!querySnapshot1.empty) {
    await deleteDoc(querySnapshot1.docs[0].ref);
  }
}

export const removefavorite = async (userId, data) => {
  console.log("removefavorite", userId, data);
  const userDocRef = doc(db, "users", userId);
  const favoritesCollectionRef = collection(userDocRef, 'favorites');
  const q = query(favoritesCollectionRef, where("id", "==", data.id));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    await deleteDoc(querySnapshot.docs[0].ref);
  }
}

export const fetchUserFavorites = async (userId) => {
  console.log("fetchUserFavorites", userId);
  try {
    const userDocRef = doc(db, "users", userId);
    const favoritesCollectionRef = collection(userDocRef, "favorites");
    const favoritesSnapshot = await getDocs(favoritesCollectionRef);
    const favoriteIds = favoritesSnapshot.docs.map((doc) => { return { id: doc.data()?.id } });
    return favoriteIds;
  } catch (error) {
    console.error("Error fetching user favorites: ", error);
    throw error;
  }
};

export const getSubscribedItems = async (userId) => {
  console.log("getSubscribedItems", userId);
  try {
    const userDocRef = doc(db, "users", userId);
    const favoritesCollectionRef = collection(userDocRef, "subscribed");
    const subscriSnapshot = await getDocs(favoritesCollectionRef);
    const ids = subscriSnapshot.docs.map((doc) => { return { id: doc.data()?.id } });
    return ids;
  } catch (error) {
    console.error("Error fetching user favorites: ", error);
    throw error;
  }

}