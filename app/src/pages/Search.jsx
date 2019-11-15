import React, { useEffect, useState } from "react";

import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonChip
} from "@ionic/react";

import { book, build, colorFill, grid } from "ionicons/icons";
import { TagsService } from "../common/api.service";

import "./Search.scss";

const Search = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function fetchTags() {
      const { data } = await TagsService.get();
      setTags(data.tags);
    }

    fetchTags();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <div className="ion-padding">
          {tags.map(tag => (
            <IonChip key={tag}>
              <IonLabel>{tag}</IonLabel>
            </IonChip>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Search;
