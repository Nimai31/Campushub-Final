import styled from "styled-components";
import { connect } from "react-redux";
import { signInAPI } from "../actions";
import { Navigate } from "react-router-dom";

const Login = (props) => {
  return (
    <Container>
      {props.user && <Navigate to="home" />}
      <Nav>
        <a href="/">
          <img src="/images/campushub-logo1.svg" alt="" />
        </a>
      </Nav>
      <Section>
        <Hero>
          <h1>WELCOME TO YOUR COLLEGE COMMUNITY</h1>
          <img src="images/trial1.svg" alt="" />
        </Hero>
        <Form>
          <Google onClick={() => props.signIn()}>
            <img src="/images/google.svg" alt="" />
            Sign in with Google
          </Google>
        </Form>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  padding: 0px;
`;

const Nav = styled.div`
  max-width: 1128px;
  margin: auto;
  padding: 12px 0 16px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;

  & > a {
    width: 135px;
    height: 34px;
    padding-top: 20px;
    @media (max-width: 768px) {
      padding: 0 5px;
    }
  }
`;



const Section = styled.section`
  display: flex;
  align-content: start;
  min-height: 700px;
  padding-bottom: 138px;
  padding-top: 40px;
  padding: 60px 0px;
  position: relative;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1128px;
  align-items: center;
  margin: auto;

  @media (max-width: 768px) {
    margin: auto;
    min-height: 0px;
  }
`;

const Hero = styled.div`
  width: 100%;
  h1 {
    padding-bottom: 0;
    width: 55%;
    font-size: 56px;
    color: #001838;
    font-weight: bolder;
    font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
    font-weight: 200;
    line-height: 70px;
    @media (max-width: 758px) {
      text-align: center;
      font-size: 20px;
      width: 100%;
      line-height: 2;
    }
  }

  img {
    width: 700px;
    height: 670px;
    position: absolute;
    bottom: -2px;
    right: -150px;
    @media (max-width: 768px) {
      top: 230px;
      width: initial;
      position: initial;
      height: initial;
    }
  }
`;

const Form = styled.div`
  margin-top: 100px;
  width: 408px;
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const Google = styled.button`
  display: flex;
  justify-content: center;
  background-color: #fff;
  align-items: center;
  height: 56px;
  width: 100%;
  border-radius: 28px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 60%),
    inset 0 0 0 2px rgb(0 0 0 / 0%) inset 0 0 0 1px rgb(0 0 0 / 0);

  vertical-align: middle;
  z-index: 0;
  transition-duration: 167ms;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.6);
  &:hover {
    background-color: rgba(207, 207, 207, 0.25);
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  signIn: () => dispatch(signInAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);