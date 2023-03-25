import { Component } from '@angular/core';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent {
  showNavBar = true
  groups = [    {      
      name: 'Group 1',
      image: "assets/lightbulb.png",
      devices: [       
        { name: 'Kitchen light' },       
        { name: 'Bedroom light' },       
        { name: 'Bathroom light' }     
       ]
    },
    {
      name: 'Group 2',
      image: "assets/door-17.png",
      devices: [
        { name: 'Kitchen door' },
        { name: 'Livingroom door' }
      ]
    },
    {
      name: 'Group 3',
      image: "assets/window.png",
      devices: [
        { name: 'Kitchen window' },
        { name: 'Livingroom window' },
        { name: 'Bedroom window' }
      ]
    }
  ];
}
