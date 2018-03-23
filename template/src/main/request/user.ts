
import {Request, Validation} from "kompost"
import {hash} from "bcrypt";
import User from "../model/user";

export default class UserRequest extends Request<User> {
    public type = User;

    protected validation: Validation = {
        username: "string",
        password: "string",
        email: ["string", "optional"]
    };

    protected async validate (model: any): Promise<User> {
        const user = new User();

        user.username = model.username;
        user.password = await hash(model.password, 10);
        user.email = model.email;
        user.type = "user";

        return user;
    }
}
