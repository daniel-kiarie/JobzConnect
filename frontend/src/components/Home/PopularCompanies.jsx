import React from "react";
import {
  FaMobileAlt,
  FaLandmark,
  FaBuilding,
  FaLightbulb,
} from "react-icons/fa";

// Defined outside to prevent array recreation on every render
const KENYAN_COMPANIES = [
  {
    id: 1,
    title: "Safaricom PLC",
    location: "Waiyaki Way, Westlands, Nairobi",
    openPositions: 15,
    icon: <FaMobileAlt size={26} />,
  },
  {
    id: 2,
    title: "Equity Bank Kenya",
    location: "Equity Centre, Upper Hill, Nairobi",
    openPositions: 8,
    icon: <FaLandmark size={26} />,
  },
  {
    id: 3,
    title: "KCB Group",
    location: "KCB Towers, Upper Hill, Nairobi",
    openPositions: 12,
    icon: <FaBuilding size={26} />,
  },
  {
    id: 4,
    title: "M-KOPA",
    location: "Kilimani, Nairobi",
    openPositions: 6,
    icon: <FaLightbulb size={26} />,
  },
];

const PopularCompanies = () => {
  return (
    <section className="companies">
      <div className="container">
        <h3>Top Employers in Kenya</h3>
        <div className="banner">
          {KENYAN_COMPANIES.map(
            ({ id, title, location, openPositions, icon }) => (
              <div className="card" key={id}>
                <div className="content">
                  <div className="icon">{icon}</div>
                  <div className="text">
                    <p className="title">{title}</p>
                    <p className="location">{location}</p>
                  </div>
                </div>
                <button className="positions-btn">
                  Open Positions: <span>{openPositions}</span>
                </button>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularCompanies;
