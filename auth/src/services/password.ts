import * as bcrypt from "bcrypt";

export class Password {
  static toHash(password: string): Promise<string> {
    return bcrypt.hash(password, Number.parseInt(`${process.env.SALT_HASH}`));
  }
  static toCompare(
    currentPassword: string,
    supplyPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(supplyPassword, currentPassword);
  }
}
