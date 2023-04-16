import { Injectable } from '@angular/core';
import { DeviceState } from 'src/app/models/deviceState';
import { DeviceTypes } from 'src/app/models/deviceType';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, onSnapshot, query } from '@angular/fire/firestore';
import { Device } from 'src/app/models/device';
import { Type } from '@angular/compiler';
import Constants from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private firestore:Firestore){

  }
}