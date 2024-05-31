import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { connect } from "react-redux";
import { fetchUserDetailsByEmail, getArticlesAPI } from "../actions"; // Importing the necessary actions
import { Navigate } from "react-router-dom";

const OtherUserProfile = (props) => {
  const { email } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    if (email) {
      props.fetchUserDetailsByEmail(email).then(() => setLoading(false));
    }
  }, [email]);

  const handleCertificateClick = (cert) => {
    setSelectedCertificate(cert);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!props.user) {
    return <Navigate to="/" />;
  }

  return (
    <Container>
      <ProfileCard>
        <div>
          {props.userDetails && props.userDetails.profilePicture ? (
            <img className="profileImg" src={props.userDetails.profilePicture} alt="User" />
          ) : (
            <img className="profileImg" src="/images/user.svg" alt="User" />
          )}
          <UserInfo>
            <h2>{props.userDetails.username}</h2>
            <p>{email}</p>
            <h3>About : {props.userDetails.headline}</h3>
            <h3>Branch : {props.userDetails.branch}</h3>
            <h3>Semester : {props.userDetails.semester}</h3>
            {props.userDetails.links && (
              <h3>
                Resume/ Coding Links :
                <a
                  href={props.userDetails.links}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {props.userDetails.links}
                </a>
              </h3>
            )}
          </UserInfo>
        </div>
      </ProfileCard>
      <ProfileCard>
        <div>Certificates</div>
        <Certificates>
          {props.userDetails.certificates && props.userDetails.certificates.length > 0 ? (
            props.userDetails.certificates.map((certificate, index) => (
              <Certificate key={index} onClick={() => handleCertificateClick(certificate)}>
                <img className="certificate" src={certificate.url} alt={certificate.name} />
              </Certificate>
            ))
          ) : (
            <p>No certificates uploaded.</p>
          )}
        </Certificates>
      </ProfileCard>
      <ProfileCard>
        <div>Skills</div>
        <SkillList>
            {props.userDetails.skills && props.userDetails.skills.map((skill, index) => (
              <SkillItem key={index}>
                {skill}
              </SkillItem>
            ))}
          </SkillList>
      </ProfileCard>
      {selectedCertificate && (
        <EnlargedCertificate>
          <img src={selectedCertificate.url} alt={selectedCertificate.name} />
          <button onClick={() => setSelectedCertificate(null)}>Close</button>
        </EnlargedCertificate>
      )}
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

  .profileImg {
    width: 100px;
    border-radius: 50%;
    margin-bottom: 20px;
  }

  .certificate {
    width: 150px;
    height: 100px;
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

    a {
      color: #001838;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const Certificates = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;

  p {
    color: rgba(0, 0, 0, 0.6);
  }
`;

const Certificate = styled.div`
  margin: 10px 0;

  a {
    color: #001838;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
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
  }

  button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #001838;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const SkillList = styled.div`
  margin-top: 20px;
`;

const SkillItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f3f3f3;
  margin-bottom: 10px;
  border-radius: 5px;
  button {
    background: none;
    border: none;
    color: red;
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
  fetchUserDetailsByEmail: (email) => dispatch(fetchUserDetailsByEmail(email)),
  getArticles: () => dispatch(getArticlesAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherUserProfile);
