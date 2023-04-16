import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceContainerComponent } from './device-container/device-container.component';
import { DoorComponent } from './door/door.component';
import { ToggleComponent } from './toggle/toggle.component';

import { MatButtonModule } from '@angular/material/button';
import { FanComponent } from './fan/fan.component';
import { WindowComponent } from './window/window.component';
import { ScreenComponent } from './screen/screen.component';
import { BuzzerComponent } from './buzzer/buzzer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DeviceContainerComponent,
    DoorComponent,
    ToggleComponent,
    FanComponent,
    WindowComponent,
    ScreenComponent,
    BuzzerComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    DeviceContainerComponent
  ]
})

export class DevicesModule {  }
