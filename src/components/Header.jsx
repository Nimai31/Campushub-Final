import { connect } from "react-redux";
import styled from "styled-components";
import { signOutAPI, setSearchQuery } from "../actions";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const Header = (props) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    props.setSearchQuery(e.target.value);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };
  const handleHomeClick = () => {
    navigate("/home");
  };
  const handleCampuHubClick = () => {
    navigate("/home");
  };

  const handleProjectClick = () => {
    navigate("/procollab");
  };

  const handleEventClick = () => {
    navigate("/events");
  };

  const handleNotificationClick = () => {
    navigate("/notification");
  }

  return (
    <Container>
      <Content>
        <Logo onClick={handleCampuHubClick}>
          <a>
            <img src="/images/header-logo.svg" alt="" />
          </a>
        </Logo>
        <Search>
          <div>
            <input
              type="text"
              placeholder="Search "
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <SearchIcon>
            <img src="/images/search-icon.svg" alt="" />
          </SearchIcon>
        </Search>
        <Nav>
          <NavListWrap>
            <NavList
              onClick={handleHomeClick}
              className={location.pathname === "/home" ? "active" : ""}
            >
              <a>
                <img src="/images/nav-home.svg" className="home" alt="" />
                <span>Home</span>
              </a>
            </NavList>

            <NavList
              onClick={handleEventClick}
              className={location.pathname === "/events" ? "active" : ""}
            >
              <a>
                <img src="/images/nav-events.svg" className="events" alt="" />
                <span>Event Hub</span>
              </a>
            </NavList>

            <NavList
              onClick={handleProjectClick}
              className={location.pathname === "/procollab" ? "active" : ""}
            >
              <a>
                <img
                  src="/images/nav-project-colab.svg"
                  className="projects"
                  alt=""
                />
                <span>Project Hub</span>
              </a>
            </NavList>

            <NavList onClick={handleNotificationClick}
              className={location.pathname === "/notification" ? "active" : ""}>
              <a>
                <img
                  src="/images/nav-notifications.svg"
                  className="notifications"
                  alt=""
                />
                <span>Notifications</span>
              </a>
            </NavList>

            <NavList
              onClick={handleProfileClick}
              className={location.pathname === "/profile" ? "active" : ""}
            >
              <a>
                {props.user && props.user.photoURL ? (
                  <img className="prof" src={props.user.photoURL} alt="" />
                ) : (
                  <img src="/images/user.svg" alt="" />
                )}
                <span>View Profile</span>
              </a>
            </NavList>

            <NavList onClick={() => props.SignOut()}>
              <a>
                <img src="/images/sign-out.svg" alt="" />
                <span>Sign Out</span>
              </a>
            </NavList>
          </NavListWrap>
        </Nav>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  background-color: #98c5e9;
  border-bottom: 3px solid #001838;
  left: 0;
  padding: 0 24px;
  position: fixed;
  top: 0;
  width: 100vw;
  height: 80px;
  z-index: 100;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  min-height: 100%;
  max-width: 1128px;
`;

const Logo = styled.span`
  cursor: pointer;
  margin-right: 8px;
  font-size: 0px;
  & > a {
    img {
      height: 40px;
      width: 40px;
    }
  }
`;

const Search = styled.div`
  opacity: 1;
  flex-grow: 1;
  position: relative;
  & > div {
    max-width: 280px;
    input {
      border: none;
      box-shadow: none;
      background-color: #eef3f8;
      border-radius: 2px;
      color: rgba(0, 0, 0, 0.9);
      width: 218px;
      padding: 0 8px 0 40px;
      line-height: 1.75;
      font-weight: 400;
      font-size: 14px;
      height: 34px;
      border-color: #dce6f1;
      vertical-align: text-top;
    }
  }
`;

const SearchIcon = styled.div`
  width: 40px;
  position: absolute;
  z-index: 1;
  top: 10px;
  left: 2px;
  border-radius: 0 2px 2px 0;
  margin: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Nav = styled.nav`
  margin-left: auto;
  display: block;
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    bottom: 0;
    background: white;
    width: 100%;
  }
`;

const NavListWrap = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  list-style-type: none;

  .active {
    span:after {
      content: "";
      transform: scaleX(1);
      border-bottom: 2px solid var(--white, #fff);
      bottom: 0;
      left: 0;
      position: absolute;
      transition: transform 0.2s ease-in-out;
      width: 100%;
      border-color: #001838;
    }
  }
`;

const NavList = styled.li`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 2px;
  a {
    align-items: center;
    background: transparent;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-weight: 400;
    justify-content: center;
    line-height: 1.5;
    min-height: 52px;
    min-width: 80px;
    position: relative;
    text-decoration: none;
    img {
      max-height: 35px;
      max-width: 35px;
      padding-top: 5px;
      padding-bottom: 5px;
    }
    .prof {
      border-radius: 50%;
    }

    .home {
      max-height: 31px;
      padding-bottom: 9px;
    }

    .projects {
      max-height: 31px;
      padding-bottom: 9px;
    }

    .events {
      max-height: 36px;
      padding-bottom: 4px;
    }

    span {
      color: #001838;
      font-weight: bold;
      display: flex;
      align-items: center;
    }

    @media (max-width: 768px) {
      min-width: 70px;
    }
  }

  &:hover,
  &:active {
    a {
      span {
        color: rgba(0, 0, 0, 0.7);
      }
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  SignOut: () => dispatch(signOutAPI()),
  setSearchQuery: (query) => dispatch(setSearchQuery(query)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);