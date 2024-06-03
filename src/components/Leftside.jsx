import styled from "styled-components";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjectsAPI,fetchUserDetails } from "../actions";

const Leftside = (props) => {
  const [showProjects, setShowProjects] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.projects.length) {
      props.getProjects();
    }
  }, []);

  useEffect(() => {
    if (props.user) {
      props.fetchUserDetails(props.user.email);
    }
  }, [props.user]);

  const handleExploreProjects = () => {
    setShowProjects(!showProjects);
  };

  const handleDiscoverMoreClick = () => {
    navigate('/procollab');
  };

  return (
    <Container>
      <ArtCard>
        <UserInfo>
          <CardBackground />
          <a>
            <Link>
              <a>
                {props.user && props.user.photoURL ? (
                  <img src={props.user.photoURL} alt="" />
                ) : (
                  <img src="/images/user.svg" alt="" />
                )}
              </a>
              Welcome, {props.user ? props.user.displayName : "there"}
              <p className="email">{props.user? props.user.email: "email"}</p>
            </Link>
          </a>
        </UserInfo>
        <Widget>
          <a>
            <div>
              <img src = "/images/info.svg" alt ="" />
              <span className="headline">{props.userDetails ? props.userDetails.headline: "headline"}</span>
              <span className="branch">{props.userDetails ? props.userDetails.branch: "branch"} - sem {props.userDetails ? props.userDetails.semester: "semester"}</span>
            </div>
          </a>
        </Widget>
      </ArtCard>

      <CommunityCard>
        
        <a>
          <span>
            Explore Projects
            <img onClick={handleExploreProjects} src="/images/plus-icon.svg" alt="" />
          </span>
        </a>
        {showProjects && (
          <ProjectList>
          {props.projects.slice(0, 5).map((project) => (
            <ProjectItem key={project.id}>
              {project.name}
            </ProjectItem>
          ))}
          <ProjectItem className ="discover" onClick={handleDiscoverMoreClick}>
          Discover more
          </ProjectItem>
        </ProjectList>
          
        )}
      </CommunityCard>
    </Container>
  );
};

const Container = styled.div`
  grid-area: leftside;
`;

const ArtCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #98c5e9;
  border-radius: 5px;
  transition: box-shadow 83ms;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  border: 3px solid #001838;
`;

const UserInfo = styled.div`
  padding: 12px 12px 16px;
  word-wrap: break-word;
  word-break: break-word;
  border-bottom: 3px solid #001838;
`;

const Widget = styled.div`
  padding-top: 12px;
  padding-bottom: 12px;
  div{
    display: flex;
    flex-direction: column;
    text-align: center;

    .headline{
      font-size: 16px;
      font-weight: bolder;
      padding-bottom: 5px;
    }

    .branch{
      font-size: 14px;
      font-weight: bolder;
      color: rgba(0, 0, 0, 0.8);
    }

    img{
      height: 45px;
      margin-bottom: 10px;
    }
  }
`;

const CardBackground = styled.div`
  background: url("/images/trial-bg.webp");
  background-position: center;
  background-size: 462px;
  height: 54px;
  margin: -12px -12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Link = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    margin: -38px auto 12px;
    border-radius: 50%;
  }
  p{
    font-size: 13px;
    color: rgba(0, 0, 0, 0.7);
  }
`;


const CommunityCard = styled(ArtCard)`
  padding: 8px 0 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  font-weight: bolder;
  a {
    color: black;
    padding: 4px 12px 4px 12px;
    font-size: 16px;

    span {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 3px;
    }

    .dismore{
      border-top: none;
      align-items: left;
      &:hover {
      color: #0a66c2;
      cursor: pointer;
  }
    }
  }
`;

const ProjectList = styled.div`
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  color: rgba(0,0,0,0.7);
  .discover{
    padding-top: 2px;
    padding-bottom: 2px;
    cursor: pointer;
    color: black;
    font-size: 14px;
  }
`;

const ProjectItem = styled.div`
  display: block;
  font-size: 12px;
  padding: 4px 0;
`;



const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    projects: state.projectState.projects,
    userDetails: state.userState.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getProjects: () => dispatch(getProjectsAPI()),
  fetchUserDetails: (email) => dispatch(fetchUserDetails(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Leftside);