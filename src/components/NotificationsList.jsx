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
    <Container>
        {!props.user && <Navigate to="/" />}
      <NotificationList>
        {notifications.map((notification, index) => (
          <NotificationItem key={index}>{notification}</NotificationItem>
        ))}
      </NotificationList>
    </Container>
  );
};


const Container = styled.div`
  
`;

const NotificationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0; 
  padding-top: 400px; 
`;

const NotificationItem = styled.li`
  background-color: #f0f0f0; 
  padding: 10px 15px;
  margin-bottom: 5px; 
  border-radius: 5px;
  font-size: 14px; 
`;

const mapStateToProps = (state) => {
    return {
      user: state.userState.user,
    };
  };
  
export default connect(mapStateToProps)(NotificationsList);