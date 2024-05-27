import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchUserDetailsByEmail } from "../actions"; // Assuming you have an action to fetch user details by email
import { connect } from "react-redux";
import { getArticlesAPI } from "../actions";


const OtherUserProfile = (props) => {
  const { email } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (email) {
      props.fetchUserDetailsByEmail(email).then(() => setLoading(false));
    }
  }, [email]);

  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <ProfileCard>
        <div>
          {props.userDetails && props.userDetails.profilePicture ? (
            <img src={props.userDetails.profilePicture} alt="User" />
          ) : (
            <img src="/images/user.svg" alt=" " />
          )}
          <UserInfo>
            <h2>{ props.userDetails.username}</h2>
            <p>{ email }</p>
            <h3>About : {props.userDetails.headline}</h3>
            <h3>Branch : {props.userDetails.branch}</h3>
            <h3>Semester : {props.userDetails.semester}</h3>
            {props.userDetails.links && (
              <h3>Resume/ Coding Links : 
                <a href={props.userDetails.links} target="_blank" rel="noopener noreferrer">
                  {props.userDetails.links}
                </a>
              </h3>
            )}
          </UserInfo>
        </div>
      </ProfileCard>
      <ProfileCard>
        <div>Certificates</div>
      </ProfileCard>
      <ProfileCard>
        <div>Skills</div>
      </ProfileCard>
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

    a {
      color: #001838;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    userDetails: state.userState.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchUserDetailsByEmail: (email) => dispatch(fetchUserDetailsByEmail(email)),
  getArticles: () => dispatch(getArticlesAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherUserProfile);