import React from 'react';

import {
  IonPopover,
  IonListHeader,
  IonChip,
  IonLabel
} from '@ionic/react';

const TagsPopover = ({ tags, isOpen, onDidDismiss, onSelectTag }) => {
  return (
    <IonPopover
        isOpen={isOpen}
        onDidDismiss={onDidDismiss}
      >
      <IonListHeader>
        Trending tags
      </IonListHeader>
      <div className="ion-padding" style={{'paddingTop': 0}}>
        {tags.map(tag => (
          <IonChip key={tag} onClick={() => onSelectTag(tag)}>
            <IonLabel>{tag}</IonLabel>
          </IonChip>
        ))}
      </div>
    </IonPopover>
  );
}

export default TagsPopover;