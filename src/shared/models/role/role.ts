export class Role {
  constructor(role: Role) {
    Object.assign(this, role);
  }

  public roleID: string;
  public name: string;
}
