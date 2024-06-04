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
  const [posterPreview, setPosterPreview] = useState(null);
  const [brochurePreview, setBrochurePreview] = useState(null);

  useEffect(() => {
    if (existingEvent) {
      setEventName(existingEvent.name);
      setEventDescription(existingEvent.description);
      setEventDate(existingEvent.date);
      setEventTime(existingEvent.time);
      setEventLocation(existingEvent.location);
      setEventPoster(existingEvent.poster);
      setPosterPreview(existingEvent.poster);
      setEventBrochure(existingEvent.brochure);
      setBrochurePreview(existingEvent.brochure);
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

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit triggered");

    // Check for required fields
    if (!eventName || !eventDescription || !eventDate || !eventTime || !eventLocation || !clubName || !duration) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      let posterURL = eventPoster;
      let brochureURL = eventBrochure;

      if (eventPoster && typeof eventPoster !== "string") {
        console.log("Uploading poster...");
        const posterRef = storage.ref().child(`posters/${eventPoster.name}`);
        await posterRef.put(eventPoster);
        posterURL = await posterRef.getDownloadURL();
        console.log("Poster uploaded, URL:", posterURL);
      }

      if (eventBrochure && typeof eventBrochure !== "string") {
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
        interested: existingEvent ? existingEvent.interested : 0,
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
          <FormItem>
            <Label>Event Name</Label>
            <Input
              type="text"
              placeholder="Event Name *"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Label>Description</Label>
            <TextArea
              placeholder="Description *"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Label>Date</Label>
            <Input
              type="date"
              placeholder="Date *"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Label>Time</Label>
            <Input
              type="time"
              placeholder="Time *"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Label>Location</Label>
            <Input
              type="text"
              placeholder="Location *"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Label>Event Poster</Label>
            {posterPreview && (
              <img src={posterPreview} alt="Event Poster Preview" style={{ width: '100px', height: 'auto', marginBottom: '10px' }} />
            )}
            <Input
              type="file"
              onChange={(e) => handleFileChange(e, setEventPoster, setPosterPreview)}
            />
          </FormItem>
          <FormItem>
            <Label>Event Brochure</Label>
            {brochurePreview && (
              <a href={brochurePreview} target="_blank" rel="noopener noreferrer">View Brochure</a>
            )}
            <Input
              type="file"
              onChange={(e) => handleFileChange(e, setEventBrochure, setBrochurePreview)}
            />
          </FormItem>
          <FormItem>
            <Label>Registration Link</Label>
            <Input
              type="text"
              placeholder="Registration Link"
              value={registrationLink}
              onChange={(e) => setRegistrationLink(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Label>Club Name</Label>
            <Input
              type="text"
              placeholder="Club Name *"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Label>Duration</Label>
            <Input
              type="text"
              placeholder="Duration *"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </FormItem>
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
  max-height: 70vh;
  overflow-y: auto;
  h2{
    margin-bottom: 15px;
  }
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

const FormItem = styled.div`
  margin-bottom: 10px;
  font-size: 12px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  display: block;
  width: 95%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
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
