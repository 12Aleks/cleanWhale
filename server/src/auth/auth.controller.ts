import {Body, Controller, Post, Req, Res, UnauthorizedException} from '@nestjs/common';
import type { Response, Request } from 'express';
import {AuthService} from "./auth.service";
import {UserDto} from "../user/dto/user.dto";

interface AuthRequest extends Request {
    cookies: {
        refresh_token?: string;
    };
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(
        @Body() dto: UserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = await this.authService.validateUser(dto.email, dto.password);
        if (!user) throw new UnauthorizedException();

        const { accessToken, refreshToken } = await this.authService.login(user);
        if (!refreshToken) throw new UnauthorizedException();

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        });

        return { accessToken };
    }

    @Post('refresh')
    async refresh(@Req() req: AuthRequest) {
        const token = req.cookies?.refresh_token;
        if (!token) throw new UnauthorizedException();
        return this.authService.refresh(token);
    }

    @Post('register')
    async register(@Body() dto: UserDto) {
        return this.authService.register(dto.email, dto.password);
    }

    @Post('logout')
    async logout(
        @Req() req: AuthRequest,
        @Res({ passthrough: true }) res: Response,
    ) {
        const token = req.cookies?.refresh_token;
        if (!token) throw new UnauthorizedException();
        await this.authService.logout(token);
        res.clearCookie('refresh_token');
        return { message: 'Logged out' };
    }
}
