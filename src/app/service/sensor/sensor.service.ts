import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  getDocs,
  deleteDoc,
  collectionData
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  constructor(private firestore: Firestore) {
  }

  listenToTriggersByProfile(profileId: string): Observable<any[]> {
    const triggerCollection: CollectionReference<DocumentData> = collection(doc(this.firestore, 'profiles', profileId), 'triggers');

    return collectionData(triggerCollection, {idField: 'id'}).pipe(
      map((triggerDocs: DocumentData[]) => {
        const triggers: any[] = triggerDocs.map((doc) => {
          return {id: doc['id'], data: doc};
        });
        return triggers;
      })
    );
  }

  async addTriggerToProfile(profileId: string, triggerData: any): Promise<void> {
    try {
      const triggerCollection: CollectionReference<DocumentData> = collection(doc(this.firestore, 'profiles', profileId), 'triggers');
      await addDoc(triggerCollection, triggerData);
      console.log('Trigger successfully added to profile');
    } catch (error) {
      console.error('Error adding trigger to profile:', error);
    }
  }

  async deleteTrigger(profileId: string, triggerId: string): Promise<void> {
    try {
      const triggerDoc = doc(this.firestore, 'profiles', profileId, 'triggers', triggerId);
      await deleteDoc(triggerDoc);
      console.log('Trigger successfully deleted');
    } catch (error) {
      console.error('Error deleting trigger:', error);
    }
  }
}
