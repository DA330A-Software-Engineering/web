import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceContainerComponent } from './device-container/device-container.component';
import { DoorComponent } from './door/door.component';
import { ToggleComponent } from './toggle/toggle.component';

import { MatButtonModule } from '@angular/material/button';
import { FanComponent } from './fan/fan.component';


@NgModule({
  declarations: [
    DeviceContainerComponent,
    DoorComponent,
    ToggleComponent,
    FanComponent
  ],
  imports: [
    CommonModule,

    MatButtonModule
  ],
  exports: [
    DeviceContainerComponent
  ]
})

export class DevicesModule {  }
