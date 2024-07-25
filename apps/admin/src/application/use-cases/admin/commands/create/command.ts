export class CreateAdminCommand {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly token: string;
  readonly roleId: number;

  constructor(props: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token: string;
    roleId: number;
  }) {
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.password = props.password;
    this.token = props.token;
    this.roleId = props.roleId;
  }
}
