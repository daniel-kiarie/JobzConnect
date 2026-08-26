import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

const HowItWorks = () => {
  return (
    <section className="howitworks">
      <div className="container">
        <h3>How JobzConnect Works</h3>
        <div className="banner">
          {/* Step 1: Onboarding */}
          <div className="card">
            <FaUserPlus size={40} className="icon" />
            <h4>Create Your Profile</h4>
            <p>
              Sign up in seconds. Build a standout resume highlighting your
              skills, or set up your company page to start hiring.
            </p>
          </div>

          {/* Step 2: Discovery */}
          <div className="card">
            <MdFindInPage size={40} className="icon" />
            <h4>Discover Opportunities</h4>
            <p>
              Browse thousands of job listings tailored to your expertise, or
              search our expansive database for top-tier talent.
            </p>
          </div>

          {/* Step 3: Action */}
          <div className="card">
            <IoMdSend size={40} className="icon" />
            <h4>Apply & Connect</h4>
            <p>
              Submit applications with a single click, or easily review profiles
              and recruit the perfect candidates for your team.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
