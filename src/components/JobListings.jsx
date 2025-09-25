import {useState, useEffect} from 'react';
import JobListing from './JobListing';
import Spinner from './Spinner';
import localData from '../jobs.json';

import React from 'react'

const JobListings = ({isHome = false}) => {
 const[jobs, setJobs] = useState([]);
  const[loading, setLoading] = useState(true);
  useEffect ( () => {
    const fetchJobs = async () => {
      try {
        const apiUrl = isHome ? '/api/jobs?_limit=3' : '/api/jobs';
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const jobsArray = Array.isArray(data) ? data : data.jobs;
        if (jobsArray && jobsArray.length > 0) {
          setJobs(jobsArray);
        } else {
          throw new Error('Empty jobs payload');
        }
      } catch (e) {
        try {
          const fallbackJobs = localData?.jobs || [];
          setJobs(isHome ? fallbackJobs.slice(0, 3) : fallbackJobs);
        } catch (_) {
          setJobs([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  },[isHome]);
  return (
     <section className="bg-blue-50 px-4 py-10">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
           { isHome ? 'Recent Jobs': 'Browse Jobs'}
          </h2>
         
            {loading ?  (
              <Spinner loading={loading} />
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {jobs.map((job) => (
            <JobListing key={job.id} job={job} />
         
            ))} 
              </div>
            ) }
            
          </div>
       
      </section>
  )
}

export default JobListings