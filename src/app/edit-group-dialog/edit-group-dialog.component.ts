import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from '../models/group';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-group-dialog',
  templateUrl: './edit-group-dialog.component.html',
  styleUrls: ['./edit-group-dialog.component.css']
})
export class EditGroupDialogComponent {
  editGroupForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { group: Group },
    private fb: FormBuilder
  ) {
    this.editGroupForm = this.fb.group({
      name: [data.group.name, Validators.required],
      description: [data.group.description],
    });
  }

  removeDevice(deviceId: string) {
    this.data.group.devices = this.data.group.devices.filter(device => device.id !== deviceId);
  }

  save() {
    if (this.editGroupForm.valid) {
      this.data.group.name = this.editGroupForm.get('name')?.value;
      this.data.group.description = this.editGroupForm.get('description')?.value;
      this.dialogRef.close(this.data.group);
    }
  }

  discard() {
    this.dialogRef.close();
  }
}
