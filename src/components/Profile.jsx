import { useState, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import UserDetailsModal from "./UserDetailsModal";
import { fetchUserDetails } from "../actions";

const Profile = (props) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (props.user) {
      props.fetchUserDetails(props.user.email);
    }
  }, [props.user]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <Container>
      {!props.user && <Navigate to="/" />}
      <ProfileCard>
        <div>
          {props.user && props.user.photoURL ? (
            <img src={props.user.photoURL} alt="User" />
          ) : (
            <img src="/images/user.svg" alt=" " />
          )}
          <UserInfo>
            <h2>{props.user ? props.user.displayName : "User Name"}</h2>
            <p>{props.user ? props.user.email : "user@example.com"}</p>
            <h3>{props.userDetails.headline}</h3>
            <h3>{props.userDetails.branch}</h3>
            <h3>{props.userDetails.semester}</h3>
            <h3>{props.userDetails.links}</h3>
          </UserInfo>
        </div>
        <ProfileActions>
          <button onClick={toggleModal}>Edit Profile</button>
        </ProfileActions>
      </ProfileCard>
      <ProfileCard>
        <div>Certificates</div>
      </ProfileCard>
      <ProfileCard>
        <div>Skills</div>
      </ProfileCard>
      <UserDetailsModal
        showModal={showModal ? "open" : "close"}
        handleClick={toggleModal}
      />
    </Container>
  );
};

const Container = styled.div`
  padding-top: 100px;
  grid-area: main;
  margin: 0px;
`;

const CommonCard = styled.div`
  margin-left: 175px;
  margin-right: 175px;
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #98c5e9;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  border: 3px solid #001838;
`;

const ProfileCard = styled(CommonCard)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
  margin-bottom: 50px;

  img {
    width: 100px;
    border-radius: 50%;
    margin-bottom: 20px;
  }
`;

const UserInfo = styled.div`
  text-align: center;

  h2 {
    margin: 0;
    font-size: 24px;
    color: #001838;
  }

  p {
    margin: 5px 0;
    color: rgba(0, 0, 0, 0.6);
  }

  h3 {
    margin: 5px 0;
    color: #001838;
  }
`;

const ProfileActions = styled.div`
  margin-top: 20px;

  button {
    margin: 0 10px;
    padding: 10px 20px;
    color: #001838;
    background-color: #fff;
    border: 1px solid #001838;
    border-radius: 20px;
    cursor: pointer;
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    userDetails: state.userState.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchUserDetails: (email) => dispatch(fetchUserDetails(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
