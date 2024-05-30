import { auth, provider, storage } from "../firebase";
import db from "../firebase";
import firebase from "firebase/app"
import {
  SET_USER,
  SET_LOADING_STATUS,
  GET_ARTICLES,
  SET_USER_DETAILS,
  ADD_COMMENT,
  DELETE_ARTICLE,
  ADD_PROJECT,
  GET_PROJECTS,
  ADD_PROJECT_MEMBER,
  DELETE_PROJECT,
  UPDATE_PROJECT,
  SET_CERTIFICATES,
} from "./actionType";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const getArticles = (payload) => ({
  type: GET_ARTICLES,
  payload: payload,
});

export const deleteArticle = (articleId) => ({
  type: DELETE_ARTICLE,
  articleId,
})

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


export const addProject = (project) => ({
  type: ADD_PROJECT,
  project,
});

export const getProjects = (projects) => ({
  type: GET_PROJECTS,
  projects,
});

export const addProjectMember = (projectId, member) => ({
  type: ADD_PROJECT_MEMBER,
  projectId,
  member,
});

export const deleteProject = (projectId) => ({
  type: DELETE_PROJECT,
  projectId,
});

export const updateProject = (projectId, projectData) => ({
  type: UPDATE_PROJECT,
  projectId,
  projectData,
});

export const setCertificates = (certificates) => ({
  type: SET_CERTIFICATES,
  certificates,
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
 
export const deleteArticleAPI = (articleId) => {
  return async (dispatch) => {
    try {
      await db.collection("articles").doc(articleId).delete();
      dispatch(deleteArticle(articleId));
    } catch (error) {
      console.error("Error deleting article: ", error);
    }
  };
};

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

export const addProjectAPI = (project) => {
  return async (dispatch) => {
    const projectRef = db.collection("projects").doc();

    projectRef.set(project)
      .then(() => {
        dispatch(addProject({ id: projectRef.id, ...project }));
      })
      .catch((error) => {
        console.error("Error adding project: ", error);
      });
  };
};

export const getProjectsAPI = () => {
  return (dispatch) => {
    db.collection("projects")
      .get()
      .then((querySnapshot) => {
        const projects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(getProjects(projects));
      })
      .catch((error) => {
        console.error("Error fetching projects: ", error);
      });
  };
};

export const addProjectMemberAPI = (projectId, member) => {
  return async (dispatch) => {
    const projectRef = db.collection("projects").doc(projectId);

    const doc = await projectRef.get();
    if (doc.exists) {
      const projectData = doc.data();
      const members = projectData.members || [];

      members.push(member);

      projectRef.update({ members })
        .then(() => {
          dispatch(addProjectMember(projectId, member));
        })
        .catch((error) => {
          console.error("Error adding project member: ", error);
        });
    } else {
      console.log("No such project!");
    }
  };
};

export const deleteProjectAPI = (projectId) => {
  return async (dispatch) => {
    try {
      await db.collection("projects").doc(projectId).delete();
      dispatch(deleteProject(projectId));
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  };
};

export const updateProjectAPI = (projectId, projectData) => {
  return async (dispatch) => {
    try {
      await db.collection("projects").doc(projectId).update(projectData);
      dispatch(updateProject(projectId, projectData));
    } catch (error) {
      console.error("Error updating project: ", error);
    }
  };
};

export const uploadCertificates = (email, files) => {
  return async (dispatch) => {
    const storageRef = storage.ref();
    const userRef = db.collection("users").doc(email);
    const newCertificates = [];

    for (const file of files) {
      const fileRef = storageRef.child(`certificates/${email}/${file.name}`);
      await fileRef.put(file);
      const fileUrl = await fileRef.getDownloadURL();
      newCertificates.push({ name: file.name, url: fileUrl });
    }

    userRef.update({
      certificates: firebase.firestore.FieldValue.arrayUnion(...newCertificates)
    }).then(() => {
      dispatch(fetchUserDetails(email));
    }).catch((error) => {
      console.error("Error uploading certificates: ", error);
    });
  };
};
