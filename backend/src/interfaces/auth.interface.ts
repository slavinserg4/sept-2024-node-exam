export interface IAuth {
    email: string;
    password: string;
}
type IRecovery = Pick<IAuth, "email">;
export { IRecovery };
