import React, { useEffect, useState } from 'react';
import './App.css';
import { useParams } from 'react-router-dom';

const ApplicantDetailsPage = () => {
  const { applicantId } = useParams();
  const [applicantDetails, setApplicantDetails] = useState(null);
  const [education, setEducation] = useState(null);
  const [workExperience, setWorkExperience] = useState(null)
  const [skills, setSkills] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteError, setNoteError] = useState(null);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`https://cv-api-example-app-6ce5817167be.herokuapp.com/proxy/notes/${applicantId}`);
      if (!response.ok) {
        console.error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      data ? setNotes(data) : setNotes([]);
    } catch (error) {
      setNoteError(error.toString());
    }
  };    

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const results = await Promise.allSettled([
          fetch(`https://cv-api-example-app-6ce5817167be.herokuapp.com/proxy/applicant/${applicantId}`),
          fetch(`https://cv-api-example-app-6ce5817167be.herokuapp.com/proxy/education/${applicantId}`),
          fetch(`https://cv-api-example-app-6ce5817167be.herokuapp.com/proxy/work-experience/${applicantId}`),
          fetch(`https://cv-api-example-app-6ce5817167be.herokuapp.com/proxy/skills/${applicantId}`),
          fetch(`https://cv-api-example-app-6ce5817167be.herokuapp.com/proxy/notes/${applicantId}`)
        ]);
  
        const [applicantResult, educationResult, workResult, skillsResult, notesResult] = results;
  
        const applicantResponse = applicantResult.status === 'fulfilled' ? applicantResult.value : { ok: false };
        const educationResponse = educationResult.status === 'fulfilled' ? educationResult.value : { ok: false };
        const workResponse = workResult.status === 'fulfilled' ? workResult.value : { ok: false };
        const skillsResponse = skillsResult.status === 'fulfilled' ? skillsResult.value : { ok: false };
        const notesResponse = notesResult.status === 'fulfilled' ? notesResult.value : { ok: false, json: () => [] };
  
        if (applicantResponse.ok) {
          const applicantData = await applicantResponse.json();
          setApplicantDetails(applicantData[0]);
        }
  
        if (educationResponse.ok) {
          const educationData = await educationResponse.json();
          setEducation(educationData);
        }
  
        if (workResponse.ok) {
          const workData = await workResponse.json();
          setWorkExperience(workData);
        }
  
        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json();
          setSkills(skillsData);
        }
  
        if (notesResponse.ok) {
          const notesData = await notesResponse.json();
          setNotes(notesData);
        } else {
          setNotes([]);
        }
  
      } catch (error) {
        setError(`An error occurred: ${error.toString()}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [applicantId]);
  
  

  const createNote = async (applicantId) => {
    const newContent = prompt("Enter new content for the note:");
  if (newContent) {
    try {
      const response = await fetch(`https://cv-api-example-app-6ce5817167be.herokuapp.com/proxy/notes/${applicantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newContent })
      });
      if (response.ok) {
        fetchNotes();
      } else {
        alert('Failed to create note');
      }
    } catch (err) {
      alert('Error creating note');
    }
  }
};
  
  const updateNote = async (noteId) => {
  const newContent = prompt("Enter new content for the note:");
  if (newContent) {
    try {
      const response = await fetch(`https://cv-api-example-app-6ce5817167be.herokuapp.com/proxy/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newContent })
      });
      if (response.ok) {
        fetchNotes();
      } else {
        alert('Failed to update note');
      }
    } catch (err) {
      alert('Error updating note');
    }
  }
};

const deleteNote = async (noteId) => {
  try {
    const response = await fetch(`https://cv-api-example-app-6ce5817167be.herokuapp.com/proxy/notes/${noteId}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      fetchNotes();
    } else {
      alert('Failed to delete note');
    }
  } catch (err) {
    alert('Error deleting note');
  }
};


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!applicantDetails) {
    return <p>No applicant details found.</p>;
  }

  return (
    <div>
      <h1>Applicant Details</h1>
      <div className='details-section'>
      <h2>{applicantDetails.name}</h2>
      <ul>
        <li>Address: {applicantDetails.address}</li>
        <li>Country: {applicantDetails.country}</li>
        <li>Email: {applicantDetails.email}</li>
        <li>Phone: {applicantDetails.phone}</li>
      </ul>
      </div>
      <div className='details-section'>
      <h2>Education</h2>
      {education.map (edu => (
      <><h3>{edu.title}</h3><ul>
          <li>{edu.timespan}</li>
          <li>{edu.institution}</li>
          <li> <em>note: {edu.note}</em></li>
        </ul></>))}
      </div>
      <div className='details-section'>
      <h2>Work Experience</h2>
      {workExperience.map (exp => (
      <><h3>{exp.jobTitle}</h3><ul>
          <li><strong>{exp.company}</strong></li>
          <li><strong><em>{exp.timespan}</em></strong></li>
          {exp.details.map(detail => (<li><em>{detail}</em></li>))}
        </ul></>))}
        </div>
        <div className='details-section'>
      <h2>Skills</h2>
      {skills.map (skill => (
      <><h3>{skill.skill}</h3>
      <ul><li><em>{skill.level}</em></li>
          <li></li></ul></>))}
          </div>
        <div className='details-section'>
  <div className='notes-header'><h2>Notes</h2> <button onClick={() => createNote(applicantId)}>add +</button></div>
  <ul>
  {!(notes[0]) ? "" : (notes.map((note, index) => (
    <li key={index}>
      {note.content}
      <button onClick={() => updateNote(note.noteId)}>Update</button>
      <button className='secondary' onClick={() => deleteNote(note.noteId)}>Delete</button>
    </li>
  )))}
</ul>
</div>

      </div>
  );
};

export default ApplicantDetailsPage;