
import { Request, Validation } from "kompost"
import Auth from "../entity/auth";

export default class AuthRequest extends Request<Auth> {
    type = Auth;

    validation: Validation = {
        username: "string",
        password: "string"
    };

    protected async validate (model: any): Promise<Auth> {
        const auth = new Auth();

        auth.username = model.username;
        auth.password = model.password;

        return auth;
    }
}
