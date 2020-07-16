import React from "react";

import { IonAlert } from "@ionic/react";

const ConfirmDeletion = ({ isOpen, action, title, message }) => (
  <IonAlert
    isOpen={isOpen}
    onDidDismiss={(e) => e.detail.role && action()}
    header={title}
    message={message}
    buttons={[
      {
        text: "Yes",
        role: true,
      },
      {
        text: "No",
        role: false,
      },
    ]}
  ></IonAlert>
);

export default ConfirmDeletion;
