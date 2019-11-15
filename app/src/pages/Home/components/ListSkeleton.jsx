
import React from 'react';

import {
  IonItem,
  IonAvatar,
  IonSkeletonText,
  IonLabel
} from '@ionic/react';

const ListSkeleton = ({ items }) => {
  const placeholderItems = [];

  for (let i = 0; i < items; i++) {
    placeholderItems.push(
      <IonItem key={i}>
        <IonAvatar slot="start">
          <IonSkeletonText animated />
        </IonAvatar>
        <IonLabel>
          <h2>
            <IonSkeletonText animated style={{ width: "50%" }} />
          </h2>
          <h3>
            <IonSkeletonText animated style={{ width: "80%" }} />
          </h3>
          <p>
            <IonSkeletonText animated style={{ width: "70%" }} />
          </p>
        </IonLabel>
      </IonItem>
    );
  }

  return placeholderItems;
};

export default ListSkeleton;