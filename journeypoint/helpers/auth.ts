import { IUserLoginResponse } from "@/types/auth";

export const mapSessionUser = (
    token: string,
    user: { id?: number; name?: string; surname?: string; userName?: string; emailAddress?: string; } | null | undefined,
    userId?: number,
    expireInSeconds?: number
): IUserLoginResponse => {
    const expiresAt =
        typeof expireInSeconds === "number"
            ? new Date(Date.now() + expireInSeconds * 1000).toISOString()
            : null;

    return {
        token,
        userId: user?.id ?? userId,
        name: user?.name ?? null,
        surname: user?.surname ?? null,
        userName: user?.userName ?? null,
        emailAddress: user?.emailAddress ?? null,
        expiresAt,
    };
};
