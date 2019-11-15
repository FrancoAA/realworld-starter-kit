import React from 'react';

import {
  IonModal,
  IonButton
} from '@ionic/react';

const ComposeModal = ({ isOpen, closeModal}) => {
  return (
    <IonModal isOpen={isOpen}>
      <p>This is modal content</p>
      <IonButton onClick={closeModal}>Close Modal</IonButton>
    </IonModal>
  );
};

export default ComposeModal;