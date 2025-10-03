import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserDocument} from "../user/schema/user.schema";
import {JwtPayload} from "./dto/auth.dto";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(private jwt: JwtService,
                public usersService: UserService) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) return user;
        return null;
    }

    async refresh(refreshToken: string) {
        try {
            const payload: JwtPayload = this.jwt.verify(refreshToken);
            const user = await this.usersService.findById(payload.sub);
            if (!user || user.refreshToken !== refreshToken) throw new Error();
            return this.login(user);
        } catch {
            throw new UnauthorizedException();
        }
    }

    async login(user: UserDocument) {
        const payload: JwtPayload = {
            sub: user._id.toString(),
            email: user.email,
        };

        const accessToken = this.jwt.sign(payload, { expiresIn: '10m' });
        const refreshToken = this.jwt.sign(payload, { expiresIn: '30m' });

        await this.usersService.setRefreshToken(user._id.toString(), refreshToken);
        return { accessToken, refreshToken };
    }

    async logout(token: string) {
        const payload: JwtPayload = this.jwt.verify(token);
        await this.usersService.removeRefreshToken(payload.sub);
    }

    async register(email: string, password: string) {
        return this.usersService.create(email, password);
    }
}
