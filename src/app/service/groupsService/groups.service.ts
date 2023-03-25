import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private http: HttpClient, private firestore: Firestore) {
  
   }



  sendAction() {


    
  }

  getGroups() {



   }






}
