export abstract class DeviceState {

}

export class ToggleState extends DeviceState{
    on : boolean;
    constructor(on: boolean){
        super();
        this.on = on;
    }
}

export class OpenLockState extends DeviceState{
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


export class ScreenState extends DeviceState{
    on : boolean;
    text : string;
    constructor(on: boolean, text: string){
        super();
        this.on = on;
        this.text = text;
    }
}

export class BuzzerState extends DeviceState{
    tune : string;
    constructor(text: string, tune: string){
        super();
        this.tune = tune;
    }
}

