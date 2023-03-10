export abstract class DeviceState {

}

export class ToggleState extends DeviceState{
    on : boolean;
    constructor(on: boolean){
        super();
        this.on = on;
    }
}

export class DoorState extends DeviceState{
    locked : boolean;
    open : boolean;
    constructor(locked: boolean, open: boolean){
        super();
        this.locked = locked;
        this.open = open;
    }
}

