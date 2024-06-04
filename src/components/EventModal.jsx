import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { storage } from "../firebase"; // Import your Firebase configuration

const EventModal = ({ show, onClose, onSubmit, existingEvent }) => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventPoster, setEventPoster] = useState(null);
  const [eventBrochure, setEventBrochure] = useState(null);
  const [registrationLink, setRegistrationLink] = useState("");
  const [clubName, setClubName] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (existingEvent) {
      setEventName(existingEvent.name);
      setEventDescription(existingEvent.description);
      setEventDate(existingEvent.date);
      setEventTime(existingEvent.time);
      setEventLocation(existingEvent.location);
      setEventPoster(existingEvent.poster);
      setEventBrochure(existingEvent.brochure);
      setRegistrationLink(existingEvent.registrationLink);
      setClubName(existingEvent.clubName);
      setDuration(existingEvent.duration);
    } else {
      resetForm();
    }
  }, [existingEvent]);

  const resetForm = () => {
    setEventName("");
    setEventDescription("");
    setEventDate("");
    setEventTime("");
    setEventLocation("");
    setEventPoster(null);
    setEventBrochure(null);
    setRegistrationLink("");
    setClubName("");
    setDuration("");
  };

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    console.log("handleSubmit triggered");
    try {
      let posterURL = "";
      let brochureURL = "";

      if (eventPoster) {
        console.log("Uploading poster...");
        const posterRef = storage.ref().child(`posters/${eventPoster.name}`);
        await posterRef.put(eventPoster);
        posterURL = await posterRef.getDownloadURL();
        console.log("Poster uploaded, URL:", posterURL);
      }

      if (eventBrochure) {
        console.log("Uploading brochure...");
        const brochureRef = storage.ref().child(`brochures/${eventBrochure.name}`);
        await brochureRef.put(eventBrochure);
        brochureURL = await brochureRef.getDownloadURL();
        console.log("Brochure uploaded, URL:", brochureURL);
      }

      const eventData = {
        name: eventName,
        description: eventDescription,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        poster: posterURL,
        brochure: brochureURL,
        registrationLink: registrationLink,
        clubName: clubName,
        duration: duration,
      };

      console.log("Event Data:", eventData);
      onSubmit(eventData);
      resetForm();
    } catch (error) {
      console.error("Error uploading files: ", error);
    }
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
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
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
          <Input
            type="text"
            placeholder="Club Name"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
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
  z-index: 100;
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
  width: 95%;
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
  align-self: center;
`;

export default EventModal;
