import {Injectable} from '@angular/core';
import {DeviceState} from 'src/app/models/deviceState';
import {DeviceTypes} from 'src/app/models/deviceType';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  updateDoc,
  onSnapshot,
  query,
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  getDocs
} from '@angular/fire/firestore';

import {Device} from 'src/app/models/device';
import {Type} from '@angular/compiler';
import Constants from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  sensors$!: Observable<{ data: any; id: any }[]>
  devices$!: Observable<Device<DeviceState>[]>

  constructor(private http: HttpClient, private firestore: Firestore) {
    this.getData();
    this.sensorData()
  }

  sendAction(id: string, type: DeviceTypes, state: DeviceState): Observable<any> {
    const action = {
      id, type, state
    }
    const url = `http://${Constants.ip}:${Constants.port}/devices/actions`;
    return this.http.put(url, action)
  }

  getData() {
    const collectionInstance = collection(this.firestore, 'devices');

    this.devices$ = collectionData(collectionInstance, {idField: 'id'})
      .pipe(map(collection => {
        return collection.map(deviceDoc => {
          return new Device(deviceDoc['id'], deviceDoc['available'], deviceDoc['type'], deviceDoc['state'], deviceDoc['name'], deviceDoc['description'], deviceDoc['tag'])

        });
      }));
  }

  /** Get Groups from user email */
  async getGroupsByProfile(userEmail: string): Promise<any> {
    const groupCollection: CollectionReference<DocumentData> = collection(doc(this.firestore, 'profiles', userEmail), 'groups');
    const groupQuery: QuerySnapshot<DocumentData> = await getDocs(groupCollection);
    const groups: any[] = groupQuery.docs.map((doc) => {
      const data = doc.data();
      data['id'] = doc.id
      return data
    });
    return groups;
  }


  /** Get all devices */
  async getAllDevices(): Promise<{ id: string, data: any }[]> {
    const deviceCollection: CollectionReference<DocumentData> = collection(this.firestore, 'devices');
    const deviceQuery: QuerySnapshot<DocumentData> = await getDocs(deviceCollection);
    const devices: any[] = deviceQuery.docs.map((doc) => {
      return {id: doc.id, data: doc.data()}
    });
    return devices;
  }

  createNewGroup(groupData: any): Observable<any> {
    console.log(groupData)
    const url = `http://${Constants.ip}:${Constants.port}/groups`;
    return this.http.post(url, groupData);
  }

  deleteExistingGroup(groupId: string): Observable<any> {
    const url = `http://${Constants.ip}:${Constants.port}/groups/${groupId}`;
    return this.http.delete(url);
  }


  updateExistingGroup(name: string, devices: string[], description: string): Observable<any> {
    const groupData = {
      name,
      devices,
      description
    };
    const url = `http://${Constants.ip}:${Constants.port}/groups/${groupData}`;
    return this.http.put(url, groupData);
  }

  updateGroup(id: string, groupData: any): Observable<any> {
    const url = `http://${Constants.ip}:${Constants.port}/groups/${id}`;
    return this.http.put(url, groupData);
  }

  private sensorData() {
    const collectionInstance = collection(this.firestore, 'devices');
    this.sensors$ = collectionData(collectionInstance, {idField: 'id'})
      .pipe(map(collection => {
        return collection.map(deviceDoc => {
          return {id: deviceDoc['id'], data: deviceDoc}
        });
      }));
  }
}
