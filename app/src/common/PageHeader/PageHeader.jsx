import React from 'react';

import './PageHeader.scss';

const PageHeader = ({ title, subtitle, date, image }) => (
  <div className="PageHeader" style={{ 
      backgroundImage: `url(${image})`, 
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat' }}>

    <div className="text-container">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <p><small>{date}</small></p>
    </div>

    <div className="overlay" >  
    </div>
  </div>
);

export default PageHeader;