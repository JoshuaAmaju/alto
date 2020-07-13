import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import React, { ReactElement, ReactNode } from "react";

interface AppHeader {
  title: string;
  children?: ReactNode;
  leading?: ReactElement;
}

export default function AppHeader({ title, leading, children }: AppHeader) {
  return (
    <IonHeader className="ion-no-border">
      <IonToolbar>
        {leading ? (
          leading
        ) : (
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
        )}
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          <IonBackButton defaultHref="/" />
          {children}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
