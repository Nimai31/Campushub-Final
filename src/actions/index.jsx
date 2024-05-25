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
      });
      dispatch(setLoading(false));
    }
  };
}

export function getArticlesAPI() {
  return (dispatch) => {
    let payload;

    db.collection("articles")
      .orderBy("actor.date", "desc")
      .onSnapshot((snapshot) => {
        payload = snapshot.docs.map((doc) => doc.data());
        console.log(payload);
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
