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

export class FanState extends DeviceState{
    on : boolean;
    reverse : boolean;
    constructor(on: boolean, reverse: boolean){
        super();
        this.on = on;
        this.reverse = reverse;
    }
}

