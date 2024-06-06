import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  getProjectsAPI,
  addProjectAPI,
  deleteProjectAPI,
  updateProjectAPI,
} from "../actions";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Navigate } from "react-router-dom";
import Modal from "./Modal";

const ProjectCollab = (props) => {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectRoles, setProjectRoles] = useState([{ name: "", role: "" }]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.user) {
      props.getProjects();
    }
  }, [props.user]);

  const handleUserClick = (email) => {
    navigate(`/user/${email}`);
  };

  const handleAddRole = () => {
    setProjectRoles([...projectRoles, { name: "", role: "" }]);
  };

  const handleRoleChange = (index, field, value) => {
    const newRoles = [...projectRoles];
    newRoles[index][field] = value;
    setProjectRoles(newRoles);
  };

  const handleRemoveRole = (index) => {
    const newRoles = projectRoles.filter((_, i) => i !== index);
    setProjectRoles(newRoles);
  };

  const handleProjectSubmit = () => {
    const projectData = {
      userName: props.user.displayName,
      profilePic: props.user.photoURL,
      email: props.user.email,
      name: projectName,
      description: projectDescription,
      roles: projectRoles,
      creator: props.user.email,
      timestamp: new Date().toISOString(),
    };

    if (isEditing) {
      props.updateProject(editingProjectId, projectData);
    } else {
      props.addProject(projectData);
    }

    resetForm();
  };

  const handleEditProject = (project) => {
    setProjectName(project.name);
    setProjectDescription(project.description);
    setProjectRoles(project.roles);
    setIsEditing(true);
    setEditingProjectId(project.id);
    setShowProjectForm(true);
  };

  const handleDeleteProject = (projectId) => {
    props.deleteProject(projectId);
  };

  const resetForm = () => {
    setProjectName("");
    setProjectDescription("");
    setProjectRoles([{ name: "", role: "" }]);
    setShowProjectForm(false);
    setIsEditing(false);
    setEditingProjectId(null);
  };

  const toggleProjectForm = () => {
    if (showProjectForm) {
      resetForm();
    } else {
      setShowProjectForm(true);
    }
  };

  if (!props.user) {
    return <Navigate to="/" />;
  }

  const filteredProjects = props.projects.filter((project) =>
    project.name.toLowerCase().includes(props.searchQuery.toLowerCase())
  );

  return (
    <Container>
      <ProjectBox>
        <button onClick={toggleProjectForm}>
          Create a Project
        </button>
        <Modal show={showProjectForm} onClose={resetForm}>
          <ProjectForm>
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <textarea
              placeholder="Project Description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
            {projectRoles.map((role, index) => (
              <RoleInput key={index}>
                <input
                  type="text"
                  placeholder="Name: N/A"
                  value={role.name}
                  onChange={(e) =>
                    handleRoleChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={role.role}
                  onChange={(e) =>
                    handleRoleChange(index, "role", e.target.value)
                  }
                />
                <button onClick={() => handleRemoveRole(index)}>Remove</button>
              </RoleInput>
            ))}
            <button onClick={handleAddRole}>Add Role</button>
            <button onClick={handleProjectSubmit}>Submit</button>
            <button onClick={resetForm}>Cancel</button>
          </ProjectForm>
        </Modal>
      </ProjectBox>
      {filteredProjects.length === 0 ? (
        <p>There are no projects</p>
      ) : (
        <Content>
          {props.loading && <img src="/images/spin-loader.svg" className=".loading" />}
          {filteredProjects
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((project, key) => (
              <Project key={key}>
                <Timestamp>{formatDistanceToNow(new Date(project.timestamp))} ago</Timestamp>
                <ProjectDetails>
                  <UserInfo>
                    <img onClick={()=>{handleUserClick(project.email)}} src={project.profilePic} />
                    <h1 onClick={()=>{handleUserClick(project.email)}}>{project.userName}</h1>
                  </UserInfo>
                  <h3>{project.name}</h3>
                  <Description>{project.description || '\u00A0'.repeat(4)}</Description>
                  
                  <RoleList>
                    <h3>Roles-</h3>
                    <br/>
                    {project.roles.map((role, index) => (
                      <div><li key={index}>
                        {role.name} - {role.role}
                      </li></div>
                    ))}
                  </RoleList>
                  {project.creator === props.user.email && (
                    <Buttons>
                      <button onClick={() => handleEditProject(project)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProject(project.id)}>
                        Delete
                      </button>
                    </Buttons>
                  )}
                </ProjectDetails>
              </Project>
            ))}
        </Content>
      )}
    </Container>
  );
};

const Container = styled.div`
  grid-area: main;
  padding-top: 100px;
  max-width: 700px;
  margin: 0 auto;
`;

const ProjectBox = styled.div`
  text-align: center;
  margin-bottom: 8px;
  button {
    padding: 10px;
    background-color: #0073b1;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const ProjectForm = styled.div`
  z-index:10;
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  input,
  textarea {
    margin: 5px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  button {
    padding: 10px;
    margin-top: 10px;
    background-color: #0073b1;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const RoleInput = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  input {
    width: 40%;
  }
  button {
    margin-left: 2px;
    padding: 5px 10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const Content = styled.div`
  text-align: center;
  .loading {
    height: 30px;
    width: 30px;
  }
`;

const Project = styled.div`
  margin: 30px 0;
  padding: 20px;
  min-height: 480px;
  background-color: #98c5e9;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border: 20px solid hsla(220, 75%, 30%, 0.84);
  border-radius: 5px;
  position: relative;
`;

const Timestamp = styled.p`
  position: absolute;
  top: 10px;
  right: 10px;
  margin: 0;
`;

const ProjectDetails = styled.div`
  text-align: left;
  position: relative;
  height: 100%;
  padding-left: 20px;
  h3{
    margin-top: 20px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-left: -15px;
  img {
    border-radius: 50%;
    height: 50px;
    margin-right: 10px;
    cursor: pointer;
  }
  h1 {
    margin: 0;
    font-weight: bold;
    cursor: pointer;
  }
`;

const Description = styled.p`
  margin: 20px 0;
  white-space: pre-wrap;
  line-height: 1.5;
  min-height: 4em;
  text-align: justify;
`;

const RoleList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 5px 0;
  display: flex;
  flex-direction: column;

  li {
    margin: 3px 0;
    font-size: 17px;
    background-color:#0073b1;
    color: white;
    width: max-content;
    padding: 5px;
    border-radius: 5px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: 10px;
  right: 10px;
  button {
    margin-left: 5px;
    padding: 5px 10px;
    background-color: #0073b1;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const mapStateToProps = (state) => {
  return {
    loading: state.projectState.loading,
    user: state.userState.user,
    projects: state.projectState.projects,
    searchQuery: state.searchState.searchQuery,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getProjects: () => dispatch(getProjectsAPI()),
  addProject: (projectData) => dispatch(addProjectAPI(projectData)),
  deleteProject: (projectId) => dispatch(deleteProjectAPI(projectId)),
  updateProject: (projectId, projectData) =>
    dispatch(updateProjectAPI(projectId, projectData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollab);
