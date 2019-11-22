import React from 'react';

import {
  IonIcon
} from '@ionic/react';

import './ErrorMessage.scss';

const ErrorMessage = ({ icon, title, message, className, callToActionComponent: CallToActionComponent }) => (
  <div className={`ErrorMessage ${className || ''}`}>
    <div className='ErrorMessage__Container'>
      <IonIcon icon={icon}/>
      <h1>{title}</h1>
      <p>{message}</p>
      {CallToActionComponent}
    </div>
  </div>
);

export default ErrorMessage;
