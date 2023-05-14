import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, QuerySnapshot, collection, doc, getDocs, onSnapshot, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import Constants from 'src/app/constants';
import { Routine } from 'src/app/models/routine';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  routines$!: Observable<any>[]

  constructor(private http: HttpClient, private firestore: Firestore) {
    // Get data?
  }

  async getRoutinesByProfile(profileId: string): Promise<any> {
    const routineCollection: CollectionReference<DocumentData> = collection(doc(this.firestore, 'profiles', profileId), 'routines');
    const routineQuery: QuerySnapshot<DocumentData> = await getDocs(routineCollection);
    const routines: any[] = routineQuery.docs.map((doc) => {
      const data = doc.data();
      data['id'] = doc.id;
      return data;
    });
    return routines;
  }

  async getDevices():Promise<any> {
    const deviceCollection: CollectionReference<DocumentData> = collection(this.firestore, 'devices');
    const deviceQuery: QuerySnapshot<DocumentData> = await getDocs(deviceCollection);
    const devices: any[] = deviceQuery.docs.map((doc) => {
      const data = doc.data();
      data['id'] = doc.id;
      return data;
    });
    return devices;
  }

  createRoutine(routineData: any): Observable<any> {
    console.log(routineData)
    const url = `http://${Constants.ip}:${Constants.port}/routines`;
    return this.http.post(url, routineData);
  }

  removeRoutine(routineId: string): Observable<any> {
    const url = `http://${Constants.ip}:${Constants.port}/routines/${routineId}`
    return this.http.delete(url)
  }
}
