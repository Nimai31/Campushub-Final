import React, { useState } from "react";
import styled from "styled-components";
import ProjectCollabList from "./ProjectCollabList";
import ProjectCollabModal from "./ProjectCollabModal";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

const ProjectCollab = (props) => {
  const [showModal, setShowModal] = useState("close");
  const [currentProject, setCurrentProject] = useState(null);

  const handleModal = (status) => {
    setShowModal(status);
    if (status === "close") {
      setCurrentProject(null);
    }
  };

  const handleEditProject = (project) => {
    setCurrentProject(project);
    setShowModal("open");
  };

  return (
    <Container>
      {!props.user && <Navigate to='/'/>}
      <Header>
        <h1>Project Collaboration</h1>
        <button onClick={() => handleModal("open")}>Create New Project</button>
      </Header>
      <ProjectCollabList
        handleEditProject={handleEditProject}
      />
      <ProjectCollabModal
        showModal={showModal}
        handleClick={handleModal}
        currentProject={currentProject}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 16px;
  padding-top: 200px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h1 {
    margin: 0;
  }

  button {
    padding: 8px 16px;
    background: #0a66c2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #004182;
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};


export default connect(mapStateToProps)(ProjectCollab);

