const hasWindow = () => globalThis.window !== undefined;

export const getCookie = (name: string): string | null => {
    if (!hasWindow()) return null;
    const match = new RegExp(new RegExp(`(?:^|; )${name}=([^;]*)`)).exec(document.cookie);
    return match ? decodeURIComponent(match[1]) : null;
};

export const setCookie = (name: string, value: string, maxAgeSeconds?: number): void => {
    if (!hasWindow()) return;
    const age = maxAgeSeconds ? `; max-age=${maxAgeSeconds}` : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/${age}; SameSite=Strict`;
};

export const removeCookie = (name: string): void => {
    if (!hasWindow()) return;
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Strict`;
};
