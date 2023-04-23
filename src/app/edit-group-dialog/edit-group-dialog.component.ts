import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from '../models/group';

@Component({
  selector: 'app-edit-group-dialog',
  templateUrl: './edit-group-dialog.component.html',
  styleUrls: ['./edit-group-dialog.component.css']
})
export class EditGroupDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { group: Group }
  ) {}

  removeDevice(deviceId: string) {
    this.data.group.devices = this.data.group.devices.filter(device => device.id !== deviceId);
  }

  save() {
    this.dialogRef.close(this.data.group);
  }

  discard() {
    this.dialogRef.close();
  }
}
