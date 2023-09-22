import React from 'react';
import './App.css';
import ApplicantsPage from './Applicants';
import ApplicantDetailsPage from './ApplicantDetails'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route index element={<ApplicantsPage />} />
          <Route path="/applicants" element={<ApplicantsPage />} />
          <Route path="/applicant/:applicantId" element={<ApplicantDetailsPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
