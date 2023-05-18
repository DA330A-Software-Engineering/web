import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  Firestore,
  collection,
  doc,
  CollectionReference,
  DocumentData,
  collectionData
} from '@angular/fire/firestore';
import { HttpClient } from "@angular/common/http";
import Constants from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  constructor(private http: HttpClient, private firestore: Firestore) {
  }

  listenToTriggersByProfile(profileId: string): Observable<any[]> {
    const triggerCollection: CollectionReference<DocumentData> = collection(doc(this.firestore, 'profiles', profileId), 'triggers');

    return collectionData(triggerCollection, { idField: 'id' })
      .pipe(map(collection => {
        return collection.map(triggers => {
          return { id: triggers['id'], data: triggers }
        });
      }));
  }

  createEvent(profileId: string, triggerData: any): Observable<any> {
    const url = `http://${Constants.ip}:${Constants.port}/triggers`;
    return this.http.post(url, triggerData);
  }

  deleteEvent(triggerId: string): Observable<any> {
    const url = `http://${Constants.ip}:${Constants.port}/triggers/${triggerId}`;
    return this.http.delete(url)
  }
}
