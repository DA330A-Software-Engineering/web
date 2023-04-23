import { Action } from "./action";

export interface Routine <action extends Action>{
  id: string,
  name: string,
  description: string,
  schedule: string,
  repeatable: boolean,
  enabled: boolean,
  actions: action[]
}