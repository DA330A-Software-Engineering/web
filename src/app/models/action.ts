export interface Action {
  id: string;
  type: string;
  state: {
    [key: string]: string | boolean;
  };
}