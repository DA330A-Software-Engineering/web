import { disableDebugTools } from "@angular/platform-browser";
import { DeviceState } from "./deviceState";
import { DeviceTypes } from "./deviceType";

export class Device <Type extends DeviceState> {
    id: string;
    available: boolean;
    type: DeviceTypes;
    state: Type;
    name: string;
    description: string;
    tag: string;

    constructor(id: string, available: boolean, type: DeviceTypes, state: Type, name:string, description: string, tag: string){
        this.id = id;
        this.available = available;
        this.type = type;
        this.state = state;
        this.name = name;
        this.description = description;
        this.tag = tag;
    }
}