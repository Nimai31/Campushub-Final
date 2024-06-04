import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  getEventsAPI,
  addEventAPI,
  deleteEventAPI,
  updateEventAPI,
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
      {filteredEvents.length === 0 ? (
        <NoEventsMessage>There are no events</NoEventsMessage>
      ) : (
        <Content>
          {props.loading && (
            <img src="/images/spin-loader.svg" className="loading" alt="Loading" />
          )}
          {filteredEvents
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((event) => (
              <Event key={event.id}>
                <EventDetails>
                  <LeftSide>
                    <UserInfo onClick={() => handleUserClick(event.email)}>
                      <ProfilePic src={event.profilePic} alt="Profile" />
                      <UserName>{event.userName}</UserName>
                    </UserInfo>
                    <EventHeader>
                      <div>
                        <EventName>{event.name}</EventName>
                        <EventTime>
                          {formatDistanceToNow(new Date(event.timestamp))} ago
                        </EventTime>
                      </div>
                      <EventDateDetails>
                        {event.date} | {event.time}
                      </EventDateDetails>
                    </EventHeader>
                    <ClubName>Club Name: {event.clubName}</ClubName>
                    <EventDescription>{event.description}</EventDescription>
                    <EventLocation>Location: {event.location}</EventLocation>
                    <EventDuration>Duration: {event.duration}</EventDuration>
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
                    {event.creator === props.user.email && (
                      <Buttons>
                        <EditButton onClick={() => handleEditEvent(event)}>
                          Edit
                        </EditButton>
                        <DeleteButton onClick={() => handleDeleteEvent(event.id)}>
                          Delete
                        </DeleteButton>
                      </Buttons>
                    )}
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
`;

const EventBox = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

const CreateEventButton = styled.button`
  padding: 10px;
  background-color: #0073b1;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const NoEventsMessage = styled.p`
  text-align: center;
`;

const Content = styled.div`
  text-align: center;
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
  margin: 10px auto;
  padding: 30px;
  background-color: #98c5e9;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 900px;
  height: 700px;
  box-sizing: border-box;
  border: 28px solid hsla(220, 75%, 30%, 0.84);
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
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
`;

const ClubName = styled.h3`
  font-weight: bold;
  margin: 10px 0;
  color: #333;
`;

const EventName = styled.h3`
  margin: 0;
  color: #333;
`;

const EventTime = styled.span`
  margin-left: 10px;
  color: #777;
`;

const EventDateDetails = styled.span`
  color: #777;
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
  color: #555;
`;

const EventLocation = styled.p`
  margin: 5px 0;
  color: #777;
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
  margin-top: 10px;
`;

const EditButton = styled.button`
  padding: 5px 10px;
  margin-right: 5px;
  background-color: #0073b1;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
  color: #777;
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
});

export default connect(mapStateToProps, mapDispatchToProps)(EventCollab);

