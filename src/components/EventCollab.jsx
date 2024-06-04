import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  getEventsAPI,
  addEventAPI,
  deleteEventAPI,
  updateEventAPI,
  updateInterestedAPI,
} from "../actions";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, isAfter, parseISO } from "date-fns";
import { Navigate } from "react-router-dom";
import EventModal from "./EventModal";
import db from "../firebase";

const EventCollab = (props) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.user) {
      props.getEvents();
      checkAuthorization();

      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      const timeUntilMidnight = nextMidnight - now;
      const midnightTimer = setTimeout(() => {
        removePastEvents();
        setInterval(removePastEvents, 24 * 60 * 60 * 1000); // Repeat every 24 hours
      }, timeUntilMidnight);
      return () => clearTimeout(midnightTimer);
    }
  }, [props.user, props.getEvents]);

  const handleUserClick = (email) => {
    navigate(`/user/${email}`);
  };

  const checkAuthorization = async () => {
    if (props.user) {
      const doc = await db.collection("settings").doc("authorizedUsers").get();
      if (doc.exists) {
        const authorizedEmails = doc.data().emails;
        if (authorizedEmails.includes(props.user.email)) {
          setIsAuthorized(true);
        }
      }
    }
  };

  const handleEventSubmit = (eventData) => {
    eventData.userName = props.user.displayName;
    eventData.profilePic = props.user.photoURL;
    eventData.email = props.user.email;
    eventData.creator = props.user.email;
    eventData.timestamp = new Date().toISOString();
    eventData.interested = eventData.interested ?? 0; 
    eventData.interestedUsers = eventData.interestedUsers ?? []; 

    if (isEditing) {
      props.updateEvent(editingEvent.id, eventData);
    } else {
      props.addEvent(eventData);
    }

    resetForm();
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEditing(true);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (eventId) => {
    props.deleteEvent(eventId);
  };

  const resetForm = () => {
    setEditingEvent(null);
    setShowEventForm(false);
    setIsEditing(false);
  };

  const toggleEventForm = () => {
    if (showEventForm) {
      resetForm();
    } else {
      setShowEventForm(true);
    }
  };

  const removePastEvents = () => {
    const now = new Date();
    props.events.forEach((event) => {
      const eventDateTime = parseISO(event.date + "T" + event.time);
      if (isAfter(now, eventDateTime)) {
        props.deleteEvent(event.id);
      }
    });
  };

  const filteredEvents = props.events.filter((event) => {
    const eventDateTime = parseISO(event.date + "T" + event.time);
    return (
      event.name.toLowerCase().includes(props.searchQuery.toLowerCase()) &&
      isAfter(eventDateTime, new Date())
    );
  });

  if (!props.user) {
    return <Navigate to="/" />;
  }

  const handleInterested = (event) => {
    if (!event.interestedUsers.includes(props.user.email)) {
      props.updateInterested(event.id, props.user.email);
    }
  };

  const sortedEvents = filteredEvents.sort(
    (a, b) => b.interested - a.interested
  );

  return (
    <Container>
      <EventBox>
        {isAuthorized && (
          <CreateEventButton onClick={toggleEventForm}>
            Create Event
          </CreateEventButton>
        )}
        <EventModal
          show={showEventForm}
          onClose={resetForm}
          onSubmit={handleEventSubmit}
          existingEvent={editingEvent}
        />
      </EventBox>
      {sortedEvents.length === 0 ? (
        <NoEventsMessage>There are no events</NoEventsMessage>
      ) : (
        <Content>
          {props.loading && (
            <img src="/images/spin-loader.svg" className="loading" alt="Loading" />
          )}
          {sortedEvents
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((event) => (
              <Event key={event.id}>
                <EventDetails>
                  <LeftSide>
                    <UserInfo onClick={() => handleUserClick(event.email)}>
                      <ProfilePic src={event.profilePic} alt="Profile" />
                      <UserName>{event.userName}, {event.clubName}</UserName>
                    </UserInfo>
                    <EventHeader>

                      <EventTime>
                          {formatDistanceToNow(new Date(event.timestamp))} ago
                        </EventTime>
                    </EventHeader>
                    <EventName>{event.name}</EventName>
                    <EventDescription>{event.description}</EventDescription>
                    <EventLocation><b>Location:</b> {event.location}</EventLocation>
                    <EventDateDetails>
                        <b>Date:</b> {event.date}  
                    </EventDateDetails>
                    <EventTimeDetails>
                       <b>Time:</b> {event.time}
                    </EventTimeDetails>
                    <EventDuration><b>Duration:</b> {event.duration}</EventDuration>
                    {event.brochure && (
                      <EventBrochure
                        href={event.brochure}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Brochure
                      </EventBrochure>
                    )}
                    {event.registrationLink && (
                      <EventRegistrationLink
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Register Here
                      </EventRegistrationLink>
                    )}
                    <Buttons>
                  <InterestedButton onClick={() => handleInterested(event)}>
                    Interested ({event.interested ?? 0})
                  </InterestedButton>
                  {event.creator === props.user.email && (
                    <>
                      <EditButton onClick={() => handleEditEvent(event)}>
                        Edit
                      </EditButton>
                      <DeleteButton onClick={() => handleDeleteEvent(event.id)}>
                        Delete
                      </DeleteButton>
                    </>
                  )}
                </Buttons>
                  </LeftSide>
                  <Divider />
                  {event.poster && (
                    <RightSide>
                      <EventPoster src={event.poster} alt="Event Poster" />
                      <ZoomButton onClick={() => setZoomImage(event.poster)}>
                        Zoom
                      </ZoomButton>
                    </RightSide>
                  )}
                </EventDetails>
              </Event>
            ))}
        </Content>
      )}
      {zoomImage && (
        <ZoomModal onClick={() => setZoomImage(null)}>
          <ZoomedImage src={zoomImage} alt="Zoomed Event Poster" />
        </ZoomModal>
      )}
    </Container>
  );
};

const Container = styled.div`
  grid-area: main;
  padding-top: 100px;
  background-color: rgba(0, 0, 0, 0.07);
  min-height: 100vh;
`;

const EventBox = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

const CreateEventButton = styled.button`
  padding: 10px 20px;
  background-color: #0073b1;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #005f8b;
  }
`;

const NoEventsMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #555;
`;

const Content = styled.div`
  text-align: left;
  .loading {
    height: 30px;
    width: 30px;
  }
`;

const Event = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
  padding: 30px;
  background-color: #98c5e9;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border: 20px solid hsla(220, 75%, 30%, 0.84);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 1000px;
`;

const EventDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 10px;
  margin-top: -31px;
`;


const EventName = styled.h3`
  margin: 0;
  color: black;
  margin-top: 30px;
  margin-bottom: 10px;
`;

const EventTime = styled.span`
  margin-left: 10px;
  color: #777;
`;

const EventDateDetails = styled.span`
  color: black;
  padding-bottom: 5px;
`;

const EventTimeDetails = styled.span`
  color: black;
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  width: 50%;
`;

const RightSide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  position: relative;
`;

const Divider = styled.div`
  width: 1px;
  background-color: black;
  margin: 0 10px;
`;

const UserInfo = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: -10px;
  margin-left: -10px;
`;

const UserName = styled.p`
  margin: 0 0 0 10px;
  font-weight: bold;
`;

const ProfilePic = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const EventDescription = styled.p`
  margin: 5px 0;
  color: black;
  text-align: justify;
`;

const EventLocation = styled.p`
  margin: 5px 0;
  color: black;
`;

const EventPoster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const EventBrochure = styled.a`
  display: block;
  margin-top: 10px;
  color: #0073b1;
  text-decoration: underline;
  cursor: pointer;
`;

const EventRegistrationLink = styled.a`
  display: block;
  margin-top: 10px;
  color: #0073b1;
  text-decoration: underline;
  cursor: pointer;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 55px;
  
`;

const EditButton = styled.button`
  padding: 5px 10px;
  margin-right: 5px;
  background-color: #0073b1;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #005f8b;
  }
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #b52b2b;
  }
`;

const ZoomButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: #0073b1;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #005f8b;
  }
`;

const InterestedButton = styled.button`
  padding: 5px 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
`;

const ZoomModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ZoomedImage = styled.img`
  max-width: 90%;
  max-height: 90%;
`;

const EventDuration = styled.p`
  margin: 5px 0;
  color: black;
`;

const mapStateToProps = (state) => {
  return {
    loading: state.eventState.loading,
    user: state.userState.user,
    events: state.eventState.events,
    searchQuery: state.searchState.searchQuery,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getEvents: () => dispatch(getEventsAPI()),
  addEvent: (eventData) => dispatch(addEventAPI(eventData)),
  deleteEvent: (eventId) => dispatch(deleteEventAPI(eventId)),
  updateEvent: (eventId, eventData) =>
    dispatch(updateEventAPI(eventId, eventData)),
  updateInterested: (eventId, userEmail) => dispatch(updateInterestedAPI(eventId, userEmail)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventCollab);
