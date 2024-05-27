import { auth, provider, storage } from "../firebase";
import db from "../firebase";
import {
  SET_USER,
  SET_LOADING_STATUS,
  GET_ARTICLES,
  SET_USER_DETAILS,
  ADD_COMMENT
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

export const addComment = (articleId, comment) => ({
  type: ADD_COMMENT,
  articleId,
  comment,
});

export function signInAPI() {
  return (dispatch) => {
    auth
      .signInWithPopup(provider)
      .then((payload) => {
        const user = payload.user;

        const userRef = db.collection("users").doc(user.email);

        userRef.get().then((doc) => {
          if (!doc.exists) {
            userRef.set({
              email: user.email,
              username: user.displayName,
              profilePicture: user.photoURL,
            });
          }
        });

        dispatch(setUser(payload.user));
        dispatch(fetchUserDetails(user.email)); // Fetch user details after sign-in
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

    if (payload.image !== "") {
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
            comments: [], // Initialize comments as an empty array
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
        comments: [], // Initialize comments as an empty array
        description: payload.description,
        likes: { count: 0, users: [] }, // Initialize likes field
      });
      dispatch(setLoading(false));
    }else if (payload.description) { // New condition for text-only posts
      db.collection("articles").add({
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: "",
        sharedImage: "",
        comments: [],
        description: payload.description,
        likes: { count: 0, users: [] }, // Initialize likes field
      });

      dispatch(setLoading(false));
    } else {
      dispatch(setLoading(false));
      console.log("Post must contain at least an image, video, or text description.");
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

export const updateUserDetailsAPI = (email, profilePicture, username, details) => {
  return (dispatch) => {

    const userDetails = {...details, profilePicture, username};

    db.collection("users")
      .doc(email)
      .set(userDetails, { merge: true })
      .then(() => {
        dispatch(setUserDetails(userDetails));
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

      dispatch({
        type: 'SET_USER_DETAILS',
        payload: userDetails,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
};

export const addCommentAPI = (articleId, comment, userEmail, userImage) => {
  return async (dispatch) => {
    const userRef = db.collection("users").doc(userEmail);
    
    try {
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const username = userData.username || userEmail; // Fallback to email if username doesn't exist

        const articleRef = db.collection("articles").doc(articleId);

        const articleDoc = await articleRef.get();
        if (articleDoc.exists) {
          const articleData = articleDoc.data();
          const comments = articleData.comments || [];

          comments.push({ userEmail, username, comment, userImage });

          await articleRef.update({ comments });
          dispatch(addComment(articleId, { userEmail, username, comment, userImage }));
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("User does not exist!");
      }
    } catch (error) {
      console.error("Error fetching user details or adding comment: ", error);
    }
  };
};

