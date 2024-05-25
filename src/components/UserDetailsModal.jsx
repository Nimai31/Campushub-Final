import { useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { updateUserDetailsAPI } from "../actions";

const UserDetailsModal = (props) => {
  const [headline, setHeadline] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [links, setLinks] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const userEmail = props.user.email; // Use user email
    const userDetails = { headline, branch, semester, links };

    props.updateUserDetails(userEmail, userDetails);
    reset(e);
  };

  const reset = (e) => {
    setHeadline("");
    setBranch("");
    setSemester("");
    setLinks("");
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
                <img src="/images/close-icon.svg" alt="" />
              </button>
            </Header>
            <FormContent>
              <form onSubmit={handleSubmit}>
                <label>
                  Headline:
                  <input
                    type="text"
                    value={headline}
                    placeholder=""
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </label>
                <label>
                  Branch:
                  <input
                    type="text"
                    placeholder="Enter your branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                </label>
                <label>
                  Semester:
                  <input
                    type="text"
                    value={semester}
                    placeholder="Enter Semester"
                    onChange={(e) => setSemester(e.target.value)}
                  />
                </label>
                <label>
                  Links:
                  <input
                    type="text"
                    placeholder="Enter Coding Profile"
                    value={links}
                    onChange={(e) => setLinks(e.target.value)}
                  />
                </label>
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
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: #98c5e9;
  max-height: 90%;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: block;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    max-height: 28px;
    pointer-events: none;
  }

  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);

    svg {
      pointer-events: none;
    }
  }
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;

  form {
    display: flex;
    flex-direction: column;

    label {
      margin-bottom: 12px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.6);

      input {
        width: 100%;
        height: 35px;
        font-size: 16px;
        margin-top: 5px;
      }
    }
  }
`;

const SubmitButton = styled.button`
  border-radius: 20px;
  padding: 10px 20px;
  background: #0a66c2;
  color: white;
  border: none;
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
  updateUserDetails: (email, details) =>
    dispatch(updateUserDetailsAPI(email, details)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsModal);
