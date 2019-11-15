import React from 'react';

import {
  IonPopover,
  IonListHeader,
  IonChip,
  IonLabel
} from '@ionic/react';

const TagsPopover = ({ tags, isOpen, onDidDismiss }) => {
  return (
    <IonPopover
        isOpen={isOpen}
        onDidDismiss={onDidDismiss}
      >
      <IonListHeader>
        Trending tags
      </IonListHeader>
      <div className="ion-padding" style={{'padding-top': 0}}>
        {tags.map(tag => (
          <IonChip key={tag}>
            <IonLabel>{tag}</IonLabel>
          </IonChip>
        ))}
      </div>
    </IonPopover>
  );
}

export default TagsPopover;