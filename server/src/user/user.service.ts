import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schema/user.schema";
import {Model} from "mongoose";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async findByEmail(email: string) {
        return this.userModel.findOne({ email });
    }

    async create(email: string, password: string) {
        const hash = await bcrypt.hash(password, 10);
        return this.userModel.create({ email, password: hash });
    }

    async findById(id: string) {
        return this.userModel.findById(id);
    }


    async setRefreshToken(id: string, token: string) {
        return this.userModel.findByIdAndUpdate(id, { refreshToken: token });
    }

    async removeRefreshToken(id: string) {
        return this.userModel.findByIdAndUpdate(id, { refreshToken: null });
    }

}
