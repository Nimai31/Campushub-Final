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
import { formatDistanceToNow } from "date-fns";
import { Navigate } from "react-router-dom";
import EventModal from "./EventModal";

const EventCollab = (props) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.user) {
      props.getEvents();
    }
  }, [props.user]);

  const handleUserClick = (email) => {
    navigate(`/user/${email}`);
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

  const filteredEvents = props.events.filter((event) =>
    event.name.toLowerCase().includes(props.searchQuery.toLowerCase())
  );

  if (!props.user) {
    return <Navigate to="/" />;
  }

  return (
    <Container>
      <EventBox>
        <CreateEventButton onClick={toggleEventForm}>
          Create Event
        </CreateEventButton>
        <EventModal
          show={showEventForm}
          onClose={resetForm}
          onSubmit={handleEventSubmit}
          existingEvent={editingEvent}
        />
      </EventBox>
      {props.events.length === 0 ? (
        <NoEventsMessage>There are no events</NoEventsMessage>
      ) : (
        <Content>
          {filteredEvents
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((event, key) => (
              <Event key={key}>
                <EventDetails>
                  <UserInfo onClick={() => handleUserClick(event.email)}>
                    <UserName>{event.userName}</UserName>
                    <ProfilePic src={event.profilePic} alt="Profile" />
                  </UserInfo>
                  <EventName>{event.name}</EventName>
                  <EventDescription>{event.description}</EventDescription>
                  <EventTime>
                    {formatDistanceToNow(new Date(event.timestamp))} ago
                  </EventTime>
                  <EventDate>Date: {event.date}</EventDate>
                  <EventLocation>Location: {event.location}</EventLocation>
                  {event.poster && (
                    <EventPoster src={event.poster} alt="Event Poster" />
                  )}
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
                </EventDetails>
              </Event>
            ))}
        </Content>
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
`;

const Event = styled.div`
  margin: 10px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const EventDetails = styled.div`
  text-align: left;
`;

const UserInfo = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const UserName = styled.p`
  margin: 0 10px 0 0;
  font-weight: bold;
`;

const ProfilePic = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const EventName = styled.h3`
  margin: 10px 0;
  color: #333;
`;

const EventDescription = styled.p`
  margin: 5px 0;
  color: #555;
`;

const EventTime = styled.p`
  margin: 5px 0;
  color: #777;
`;

const EventDate = styled.p`
  margin: 5px 0;
  color: #777;
`;

const EventLocation = styled.p`
  margin: 5px 0;
  color: #777;
`;

const EventPoster = styled.img`
  margin-top: 10px;
  max-width: 100%;
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