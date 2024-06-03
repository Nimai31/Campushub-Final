import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { updateUserDetailsAPI, fetchUserDetails } from "../actions";

const UserDetailsModal = (props) => {
  const [headline, setHeadline] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [links, setLinks] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = props.user.displayName;
    const userEmail = props.user.email;
    const userProfileImage = props.user.photoURL;
    const userDetails = { headline, branch, semester, links };

    props.updateUserDetails(userEmail, userProfileImage, username, userDetails);
    reset(e);
  };

  useEffect(() => {
    if (props.user) {
      props.fetchUserDetails(props.user.email);
    }
  }, [props.user]);

  useEffect(() => {
    if (props.userDetails) {
      setHeadline(props.userDetails.headline || "");
      setBranch(props.userDetails.branch || "");
      setSemester(props.userDetails.semester || "");
      setLinks(props.userDetails.links || "");
    }
  }, [props.userDetails]);

  const reset = (e) => {
    setHeadline(props.userDetails.headline || "");
    setBranch(props.userDetails.branch || "");
    setSemester(props.userDetails.semester || "");
    setLinks(props.userDetails.links || "");
    props.handleClick(e);
  };

  return (
    <>
      {props.showModal === "open" && (
        <Container>
          <Content>
            <Header>
              <h2>Edit Profile</h2>
              <button onClick={(event) => reset(event)}>
                <img src="/images/close-icon.svg" alt="Close" />
              </button>
            </Header>
            <FormContent>
              <form onSubmit={handleSubmit}>
                <Label>
                  Headline:
                  <Input
                    type="text"
                    value={headline}
                    placeholder="Enter your headline"
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </Label>
                <Label>
                  Branch:
                  <Input
                    type="text"
                    placeholder="Enter your branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                </Label>
                <Label>
                  Semester:
                  <Input
                    type="text"
                    value={semester}
                    placeholder="Enter your semester"
                    onChange={(e) => setSemester(e.target.value)}
                  />
                </Label>
                <Label>
                  Links:
                  <Input
                    type="text"
                    placeholder="Enter coding profile link"
                    value={links}
                    onChange={(e) => setLinks(e.target.value)}
                  />
                </Label>
                <SubmitButton type="submit">Submit</SubmitButton>
              </form>
            </FormContent>
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
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: #fff;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-in-out;
  border: 5px solid #001838;

  @keyframes slideIn {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: transparent;
  color: rgba(0,0,0,0.8);
  border-radius: 10px;

  h2 {
    margin: 0;
    font-size: 20px;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  padding-right: 40px;
  form {
    display: flex;
    flex-direction: column;
  }
`;

const Label = styled.label`
  margin-bottom: 15px;
  font-size: 14px;
  color: #333;

  input {
    display: block;
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.3s;

    &:focus {
      border-color: #0a66c2;
    }
  }
`;

const Input = styled.input``;

const SubmitButton = styled.button`
  border-radius: 5px;
  padding: 10px;
  background-color: #98c5e9;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.3s;
  border: 3px solid #001838;
  &:hover {
    background: #001838;
    transform: translateY(-2px);
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    userDetails: state.userState.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateUserDetails: (email, image, username, details) =>
    dispatch(updateUserDetailsAPI(email, image, username, details)),
  fetchUserDetails: (email) => dispatch(fetchUserDetails(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsModal);
