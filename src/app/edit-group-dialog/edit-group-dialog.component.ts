import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from '../models/group';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../service/deviceService/device.service';

@Component({
  selector: 'app-edit-group-dialog',
  templateUrl: './edit-group-dialog.component.html',
  styleUrls: ['./edit-group-dialog.component.css']
})
export class EditGroupDialogComponent {
  editGroupForm: FormGroup;
  sameTypeDevices: { id: string; data: any }[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { group: Group },
    private fb: FormBuilder,
    private deviceService: DeviceService) {

    this.editGroupForm = this.fb.group({
      name: [data.group.name, Validators.required],
      description: [data.group.description],
    });

    this.getAllSameTypeDevices(this.data.group.devices).then(devices => {
      this.sameTypeDevices = devices;
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

  async discard() {
    this.dialogRef.close();
  }

  isDeviceInGroup(deviceName: string): boolean {
    return this.data.group.devices.some(device => device.data.name === deviceName);
  }

  async getAllSameTypeDevices(groupDevices: string[] | any[]) {
    const groupDeviceTypes = new Set(groupDevices.map(device => device.data.type));
    const allDevices = await this.deviceService.getAllDevices();

    return allDevices.filter(device => groupDeviceTypes.has(device.data.type));
  }

  thereAreDevicesNotInTheList(devices: string[] | any[]): boolean {
    return this.sameTypeDevices.length !== devices.length;
  }

  async addDevice(deviceNameToAdd: string) {
    if (!this.isDeviceInGroup(deviceNameToAdd)) {
      const allDevices = await this.deviceService.getAllDevices();
      const device = allDevices.find(device => device.data.name === deviceNameToAdd);

      if (device) {
        (this.data.group.devices as { id: string; data: any }[]).push(device);
      }
    }
  }

}
