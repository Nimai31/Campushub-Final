import { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getProjectsAPI } from "../actions";
import { Navigate } from "react-router-dom";

const ProjectCollabList = (props) => {
  useEffect(() => {
    if (!props.projects.length) {
      props.getProjects();
    }
  }, []);

  return (
    <Container>
      {props.projects.length > 0 ? (
        props.projects
          .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds) // Sort by timestamp
          .map((project) => (
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
                  onClick={() => props.handleEditProject(project)}
                >
                  Edit
                </EditButton>
              )}
            </ProjectItem>
          ))
      ) : (
        <p>No projects available</p>
      )}
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  getProjects: () => dispatch(getProjectsAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollabList);
