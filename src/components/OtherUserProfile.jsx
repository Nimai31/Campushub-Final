import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { connect } from "react-redux";
import { fetchUserDetailsByEmail, getArticlesAPI } from "../actions";
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
      <ProfileSection>
        <ProfileCard>
          <div>
            {props.userDetails && props.userDetails.profilePicture ? (
              <img
                className="profileImg"
                src={props.userDetails.profilePicture}
                alt="User"
              />
            ) : (
              <img className="profileImg" src="/images/user.svg" alt="User" />
            )}
            <UserInfo>
              <h2>{props.userDetails.username}</h2>
              <p>{email}</p>
              <h3>About: {props.userDetails.headline}</h3>
              <h3>Branch: {props.userDetails.branch}</h3>
              <h3>Semester: {props.userDetails.semester}</h3>
              {props.userDetails.links && (
                <h3>
                  Resume/Coding Links:{" "}
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
        <SkillsCard>
          <div>
            <h3>Skills</h3>
            <SkillList>
              {props.userDetails.skills &&
                props.userDetails.skills.map((skill, index) => (
                  <SkillItem key={index}>{skill}</SkillItem>
                ))}
            </SkillList>
          </div>
        </SkillsCard>
        <CertificatesCard>
          <div>
            <h3>Certificates</h3>
            <CertificatesGrid>
              {props.userDetails.certificates &&
              props.userDetails.certificates.length > 0 ? (
                props.userDetails.certificates.map((certificate, index) => (
                  <CertificateItem
                    key={index}
                    onClick={() => handleCertificateClick(certificate)}
                  >
                    <img
                      className="certificate"
                      src={certificate.url}
                      alt={certificate.name}
                    />
                  </CertificateItem>
                ))
              ) : (
                <p>No certificates uploaded.</p>
              )}
            </CertificatesGrid>
          </div>
        </CertificatesCard>
      </ProfileSection>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Arial", sans-serif;
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