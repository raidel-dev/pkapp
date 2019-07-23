import { Contract } from "../contract/contract";

export class Entity {
  constructor(entity: Entity) {
    Object.assign(this, entity);
  }

  public id: number;
  public name: string;
  public addDate: Date;
  public userID: string;
  public modifiedUserID: string;

  public contracts: Contract[];

  // for menu selections
  public selected: boolean;
}