import { useState, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { postProjectAPI, updateProjectAPI } from "../actions";
import firebase from "firebase";

const ProjectCollabModal = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roles, setRoles] = useState([{ role: "", name: "" }]);

  useEffect(() => {
    if (props.currentProject) {
      setTitle(props.currentProject.title);
      setDescription(props.currentProject.description);
      setRoles(props.currentProject.roles);
    }
  }, [props.currentProject]);

  const handleRoleChange = (index, key, value) => {
    const updatedRoles = [...roles];
    updatedRoles[index][key] = value;
    setRoles(updatedRoles);
  };

  const addRole = () => {
    setRoles([...roles, { role: "", name: "" }]);
  };

  const removeRole = (index) => {
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      roles,
      user: props.user.displayName,
      timestamp: firebase.firestore.Timestamp.now(),
      
    };
    console.log(props.currentProject.id);
    if (props.currentProject) {
      props.updateProject(props.currentProject.id, payload);
    } else {
      props.postProject(payload);
    }
    reset(e);
  };

  const reset = (e) => {
    setTitle("");
    setDescription("");
    setRoles([{ role: "", name: "" }]);
    props.handleModal("close");
  };

  return (
    <>
      
      {props.showModal === "open" && (
        <Container>
          <Content>
            <Header>
              <h2>{props.currentProject ? "Edit Project" : "Create Project"}</h2>
              <button onClick={(event) => reset(event)}>
                <img src="/images/close-icon.svg" alt="" />
              </button>
            </Header>
            <form onSubmit={handleSubmit}>
              <Editor>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Project Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                {roles.map((role, index) => (
                  <RoleInput key={index}>
                    <input
                      type="text"
                      placeholder="Role"
                      value={role.role}
                      onChange={(e) => handleRoleChange(index, "role", e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Name"
                      value={role.name}
                      onChange={(e) => handleRoleChange(index, "name", e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => removeRole(index)}>
                      Remove
                    </button>
                  </RoleInput>
                ))}
                <button type="button" onClick={addRole}>
                  Add Role
                </button>
              </Editor>
              <PostButton type="submit">
                {props.currentProject ? "Update" : "Post"}
              </PostButton>
            </form>
          </Content>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  color: black;
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.3s;
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: white;
  max-height: 90%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: block;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  display: flex;
  justify-content: space-between;

  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);
    img {
      pointer-events: none;
    }
  }
`;

const Editor = styled.div`
  padding: 12px 24px;

  input,
  textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 8px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }

  textarea {
    resize: none;
    height: 100px;
  }
`;

const RoleInput = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  input {
    width: 45%;
  }

  button {
    padding: 8px 16px;
    background: #e0e0e0;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #d0d0d0;
    }
  }
`;

const PostButton = styled.button`
  margin: 16px;
  padding: 8px 16px;
  background: #0a66c2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #004182;
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postProject: (payload) => dispatch(postProjectAPI(payload)),
  updateProject: (id, payload) => dispatch(updateProjectAPI(id, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollabModal);
