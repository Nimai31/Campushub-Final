import React, { useState, useEffect } from "react";
import styled from "styled-components";

const EventModal = ({ show, onClose, onSubmit, existingEvent }) => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventPoster, setEventPoster] = useState(null);
  const [eventBrochure, setEventBrochure] = useState(null);
  const [registrationLink, setRegistrationLink] = useState("");

  useEffect(() => {
    if (existingEvent) {
      setEventName(existingEvent.name);
      setEventDescription(existingEvent.description);
      setEventDate(existingEvent.date);
      setEventLocation(existingEvent.location);
      setEventPoster(existingEvent.poster);
      setEventBrochure(existingEvent.brochure);
      setRegistrationLink(existingEvent.registrationLink);
    } else {
      resetForm();
    }
  }, [existingEvent]);

  const resetForm = () => {
    setEventName("");
    setEventDescription("");
    setEventDate("");
    setEventLocation("");
    setEventPoster(null);
    setEventBrochure(null);
    setRegistrationLink("");
  };

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    const eventData = {
      name: eventName,
      description: eventDescription,
      date: eventDate,
      location: eventLocation,
      poster: eventPoster,
      brochure: eventBrochure,
      registrationLink: registrationLink,
    };
    onSubmit(eventData);
    resetForm();
  };

  if (!show) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>{existingEvent ? "Edit Event" : "Create Event"}</h2>
        <Form>
          <Input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
          <Input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />
          <Input
            type="file"
            onChange={(e) => handleFileChange(e, setEventPoster)}
          />
          <Input
            type="file"
            onChange={(e) => handleFileChange(e, setEventBrochure)}
          />
          <Input
            type="text"
            placeholder="Registration Link"
            value={registrationLink}
            onChange={(e) => setRegistrationLink(e.target.value)}
          />
          <SubmitButton type="button" onClick={handleSubmit}>
            {existingEvent ? "Update Event" : "Create Event"}
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background: #0073b1;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  align-self: flex-end;
`;

export default EventModal;
