import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import UserDetailsModal from "./UserDetailsModal";
import {
  fetchUserDetails,
  uploadCertificates,
  deleteCertificate,
  addSkill,
  deleteSkill
} from "../actions";

const Profile = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const certificateInputRef = useRef(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [skill, setSkill] = useState("");

  useEffect(() => {
    if (props.user) {
      props.fetchUserDetails(props.user.email);
    }
  }, [props.user]);

  useEffect(() => {
    if (props.userDetails.certificates) {
      setCertificates(props.userDetails.certificates);
    }
  }, [props.userDetails.certificates]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      if (certificates.length + files.length <= 6) {
        props.uploadCertificates(props.user.email, files);
      } else {
        alert("You can only upload up to 6 certificates.");
      }
    }
  };

  const handleCertificateClick = (cert) => {
    setSelectedCertificate(cert);
  };

  const handleCertificateDelete = (cert) => {
    props.deleteCertificate(props.user.email, cert);
    setSelectedCertificate(null);
  };

  const handleAddSkill = () => {
    if (skill.trim() !== "") {
      if (props.userDetails.skills.length < 7) {
        props.addSkill(props.user.email, skill.trim());
        setSkill("");
      } else {
        alert("You can only add up to 7 skills.");
      }
    }
  };

  const handleDeleteSkill = (skill) => {
    props.deleteSkill(props.user.email, skill);
  };

  return (
    <Container>
      {!props.user && <Navigate to="/" />}
      <ProfileSection>
        <ProfileCard>
          <div>
            {props.user && props.user.photoURL ? (
              <img className="profileImg" src={props.user.photoURL} alt="User" />
            ) : (
              <img className="profileImg" src="/images/user.svg" alt=" " />
            )}
            <UserInfo>
              <h2>{props.user ? props.user.displayName : "User Name"}</h2>
              <p>{props.user ? props.user.email : "user@example.com"}</p>
              <h3>{props.userDetails.headline}</h3>
              <h3>Branch: {props.userDetails.branch}</h3>
              <h3>Semester: {props.userDetails.semester}</h3>
              {props.userDetails.links && (
                <h3>
                  <a href={props.userDetails.links} target="_blank" rel="noopener noreferrer">
                    Coding Link: {props.userDetails.links}
                  </a>
                </h3>
              )}
            </UserInfo>
          </div>
          <ProfileActions>
            <button onClick={toggleModal}>Edit Profile</button>
          </ProfileActions>
        </ProfileCard>
        <SkillsCard>
          <div>
            <h3>Skills</h3>
            <SkillInput>
              <input
                type="text"
                placeholder="Add a skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              />
              <button onClick={handleAddSkill}>Add Skill</button>
            </SkillInput>
            <SkillList>
              {props.userDetails.skills && props.userDetails.skills.map((skill, index) => (
                <SkillItem key={index}>
                  {skill}
                  <button onClick={() => handleDeleteSkill(skill)}>Delete</button>
                </SkillItem>
              ))}
            </SkillList>
          </div>
        </SkillsCard>
        <CertificatesCard>
          <div>
            <h3>Certificates</h3>
            <input
              type="file"
              multiple
              ref={certificateInputRef}
              style={{ display: "none" }}
              onChange={handleCertificateUpload}
            />
            <button onClick={() => certificateInputRef.current.click()}>Upload Certificates</button>
            <CertificatesGrid>
              {certificates.map((cert, index) => (
                <CertificateItem key={index} onClick={() => handleCertificateClick(cert)}>
                  <img className="certificate" src={cert.url} alt={cert.name} />
                </CertificateItem>
              ))}
            </CertificatesGrid>
          </div>
        </CertificatesCard>
      </ProfileSection>
      {selectedCertificate && (
        <EnlargedCertificate>
          <img src={selectedCertificate.url} alt={selectedCertificate.name} />
          <div>
            <button onClick={() => setSelectedCertificate(null)}>Close</button>
            <button onClick={() => handleCertificateDelete(selectedCertificate)}>Delete</button>
          </div>
        </EnlargedCertificate>
      )}
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
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  padding-bottom: 100px;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
`;

const CommonCard = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #d1d1d1;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const ProfileCard = styled(CommonCard)`
  width: 30%;
  min-height: 475px;
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center; 

  .profileImg {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 20px;
    border: 3px solid #001838;
    display: block; 
    margin-left: auto;
    margin-right: auto; 
  }
`;

const SkillsCard = styled(CommonCard)`
  width: 30%;
  min-height: 475px;
`;

const CertificatesCard = styled(CommonCard)`
  width: 30%;
  min-height: 475px;

  .certificate {
    height: 100px;
    width: 150px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }

  button {
    margin: 12px 10px;
    padding: 10px 20px;
    color: #001838;
    background-color: #fff;
    border: 2px solid #001838;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
      background-color: #f0f0f0;
      transform: translateY(-2px);
    }
  }
`;

const CertificatesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  
`;

const CertificateItem = styled.div`
  cursor: pointer;
`;

const ProfileActions = styled.div`
  margin-top: 20px;

  button {
    margin: 0 10px;
    padding: 10px 20px;
    color: #001838;
    background-color: #fff;
    border: 2px solid #001838;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
      background-color: #f0f0f0;
      transform: translateY(-2px);
    }
  }
`;

const UserInfo = styled.div`
  text-align: center;

  h2 {
    margin: 0;
    font-size: 28px;
    color: #001838;
    font-weight: bold;
  }

  p {
    margin: 5px 0;
    color: rgba(0, 0, 0, 0.7);
    font-size: 16px;
  }

  h3 {
    margin: 10px 0;
    color: #001838;
    font-size: 18px;

    a {
      color: #001838;
      text-decoration: none;
      font-weight: bold;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const SkillInput = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;

  input {
    padding: 10px;
    margin-right: 10px;
    border-radius: 5px;
    border: 1px solid #001838;
    width: 200px;
    transition: box-shadow 0.3s;

    &:focus {
      box-shadow: 0 0 5px rgba(0, 24, 56, 0.5);
    }
  }

  button {
    padding: 10px 20px;
    color: #fff;
    background-color: #001838;
    border: 2px solid #001838;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
    }
  }
`;

const SkillList = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const SkillItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f3f3f3;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  button {
    background: none;
    border: none;
    color: red;
    cursor: pointer;
    font-weight: bold;
    transition: color 0.3s, transform 0.3s;

    &:hover {
      color: darkred;
      transform: scale(1.1);
    }
  }
`;

const EnlargedCertificate = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border: 3px solid #001838;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    max-width: 90%;
    max-height: 90%;
    margin-bottom: 10px;
    border: 3px solid #001838;
    border-radius: 10px;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.02);
    }
  }

  button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #001838;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
    }

    &:nth-child(2) {
      margin-left: 10px;
      background-color: red;
    }

    &:nth-child(2):hover {
      background-color: darkred;
    }
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
  uploadCertificates: (email, files) => dispatch(uploadCertificates(email, files)),
  deleteCertificate: (email, certificate) => dispatch(deleteCertificate(email, certificate)),
  addSkill: (email, skill) => dispatch(addSkill(email, skill)),
  deleteSkill: (email, skill) => dispatch(deleteSkill(email, skill)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
