import React, { useEffect, useState } from "react";
import styled from "styled-components";
import db from "../firebase";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

const NotificationsList = (props) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("notifications")
      .onSnapshot((snapshot) => {
        const fetchedNotifications = snapshot.docs.map((doc) => doc.data().notification);
        setNotifications(fetchedNotifications);
      });

    return () => unsubscribe();
  }, []);

  return (
    <BackgroundContainer>
    <Container>
      {!props.user && <Navigate to="/" />}
      <Title>Notifications</Title>
      <NotificationList>
        {notifications.map((notification, index) => (
          <NotificationItem key={index}>{notification}</NotificationItem>
        ))}
      </NotificationList>
    </Container>
    </BackgroundContainer>
  );
};

const BackgroundContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.0025); 
  height: 100vh;
  padding-top: 10px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border: 12px solid hsla(220, 75%, 30%, 0.84);
  justify-content: flex-start;
  padding: 20px;
  margin: 160px;
  background-color: #98c5e9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
`;

const NotificationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const NotificationItem = styled.li`
  background-color: hsl(195, 100%, 90%);
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  font-size: 16px;
  color: #555;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

export default connect(mapStateToProps)(NotificationsList);