export class CreateUserDto {
  email!: string;
  password!: string;
  name?: string;
  // Add other fields as needed, for example:
  // name?: string;
  // role?: string;
}
