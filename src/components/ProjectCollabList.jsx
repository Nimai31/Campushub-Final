import { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getProjectsAPI } from "../actions";
import ProjectCollabModal from "./ProjectCollabModal";

const ProjectCollabList = (props) => {
  useEffect(() => {
    props.getProjects();
  }, []);

  return (
    <Container>
      {!props.user && <Navigate to='/'/>}
      {props.projects.length > 0 ? (
        props.projects.map((project) => (
          <ProjectItem key={project.id}>
            <h3>{project.title}</h3>
            <p>by {project.user}</p>
            <p>{new Date(project.timestamp.seconds * 1000).toLocaleString()}</p>
            <p>{project.description}</p>
            <Roles>
              {project.roles.map((role, index) => (
                <Role key={index}>
                  <strong>{role.role}:</strong> {role.name}
                </Role>
              ))}
            </Roles>
            {props.user.displayName === project.user && (
              <EditButton
                onClick={() =>
                  props.setCurrentProject(project) & props.handleClick("open")
                }
              >
                Edit
              </EditButton>
            )}
          </ProjectItem>
        ))
      ) : (
        <p>No projects available</p>
      )}
      <ProjectCollabModal
        showModal={props.showModal}
        handleClick={(e) => props.handleClick(e)}
        currentProject={props.currentProject}
      />
    </Container>
  );
};

const Container = styled.div`
  // styles for container
`;

const ProjectItem = styled.div`
  // styles for project item
`;

const Roles = styled.div`
  // styles for roles
`;

const Role = styled.div`
  // styles for individual role
`;

const EditButton = styled.button`
  // styles for edit button
`;

const mapStateToProps = (state) => {
  return {
    projects: state.projectState.projects,
    user: state.userState.user,
    showModal: state.uiState.showModal,
    currentProject: state.projectState.currentProject,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getProjects: () => dispatch(getProjectsAPI()),
  setShowModal: (status) => dispatch({ type: "SET_SHOW_MODAL", status }),
  setCurrentProject: (project) =>
    dispatch({ type: "SET_CURRENT_PROJECT", project }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollabList);
