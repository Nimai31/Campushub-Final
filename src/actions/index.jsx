import { auth, provider, storage } from "../firebase";
import db from "../firebase";
import {
  SET_USER,
  SET_LOADING_STATUS,
  GET_ARTICLES,
  SET_USER_DETAILS,
} from "./actionType";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const getArticles = (payload) => ({
  type: GET_ARTICLES,
  payload: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});

export const setUserDetails = (payload) => ({
  type: SET_USER_DETAILS,
  payload,
});

export function signInAPI() {
  return (dispatch) => {
    auth
      .signInWithPopup(provider)
      .then((payload) => {
        dispatch(setUser(payload.user));
        dispatch(fetchUserDetails(payload.user.email)); // Fetch user details after sign-in
      })
      .catch((error) => alert(error.message));
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
        dispatch(fetchUserDetails(user.email)); // Fetch user details if user is already authenticated
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
}

export function postArticleAPI(payload) {
  return (dispatch) => {
    dispatch(setLoading(true));

    if (payload.image != "") {
      const upload = storage
        .ref(`images/${payload.image.name}`)
        .put(payload.image);
      upload.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`progress: ${progress}%`);
          if (snapshot.state === "RUNNING") {
            console.log(`Progress: ${progress}%`);
          }
        },
        (error) => error.code,
        async () => {
          const downloadUrl = await upload.snapshot.ref.getDownloadURL();
          db.collection("articles").add({
            actor: {
              description: payload.user.email,
              title: payload.user.displayName,
              date: payload.timestamp,
              image: payload.user.photoURL,
            },
            video: payload.video,
            sharedImage: downloadUrl,
            comments: 0,
            description: payload.description,
            likes: { count: 0, users: [] }, // Initialize likes field
          });
          dispatch(setLoading(false));
        }
      );
    } else if (payload.video) {
      db.collection("articles").add({
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: payload.video,
        sharedImage: "",
        comments: 0,
        description: payload.description,
        likes: { count: 0, users: [] }, // Initialize likes field
      });
      dispatch(setLoading(false));
    }
  };
}

export const updateArticleLikes = (articleId, userEmail) => {
  return async (dispatch) => {
    console.log(articleId);
    const articleRef = db.collection("articles").doc(articleId);

    const doc = await articleRef.get();
    if (doc.exists) {
      const articleData = doc.data();
      const likes = articleData.likes || { count: 0, users: [] };

      if (!likes.users.includes(userEmail)) {
        likes.count += 1;
        likes.users.push(userEmail);

        articleRef.update({ likes })
          .then(() => {
            dispatch(getArticlesAPI()); // Refresh articles
          })
          .catch((error) => {
            console.error("Error updating likes: ", error);
          });
      } else {
        console.log("User has already liked this post.");
      }
    } else {
      console.log("No such document!");
    }
  };
};


export function getArticlesAPI() {
  return (dispatch) => {
    let payload;

    db.collection("articles")
      .orderBy("actor.date", "desc")
      .onSnapshot((snapshot) => {
        payload = snapshot.docs.map((doc) => ({
          id: doc.id, // Include the document ID
          ...doc.data()
        }));
        console.log(payload); // For debugging
        dispatch(getArticles(payload));
      });
  };
}


export const fetchUserDetails = (email) => {
  return (dispatch) => {
    db.collection("users")
      .doc(email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          dispatch(setUserDetails(doc.data()));
        } else {
          console.error("No such document!");
        }
      })
      .catch((error) => {
        console.error("Error getting document: ", error);
      });
  };
};

export const updateUserDetailsAPI = (email, details) => {
  return (dispatch) => {
    db.collection("users")
      .doc(email)
      .set(details, { merge: true })
      .then(() => {
        dispatch(setUserDetails(details));
      })
      .catch((error) => {
        console.error("Error updating user details: ", error);
      });
  };
};

export const fetchUserDetailsByEmail = (email) => {
  return async (dispatch) => {
    try {
      let userDetails = {};

      // Fetch user details from the "users" collection
      await db.collection("users")
        .doc(email)
        .get()
        .then((doc) => {
          if (doc.exists) {
            userDetails = { ...userDetails, ...doc.data() };
          } else {
            console.error("No such document in users collection!");
          }
        });

      // Fetch user details from the "articles" collection
      await db.collection("articles")
        .where("actor.description", "==", email)
        .limit(1)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            userDetails.image = doc.data().actor.image; // Assuming the image is stored in the actor field
            userDetails.username = doc.data().actor.title;
          });
        });

      dispatch({
        type: 'SET_USER_DETAILS',
        payload: userDetails,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
};
