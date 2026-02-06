export function setCookie(name: string, value: string, maxAgeSeconds: number): void {
    const date = new Date();
    date.setTime(date.getTime() + maxAgeSeconds * 1000);

    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; expires=${date.toUTCString()}; samesite=lax`;
}

export function getCookie(name: string): string | undefined {
    const nameEncoded = encodeURIComponent(name);
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(`${nameEncoded}=`)) {
            return decodeURIComponent(cookie.substring(nameEncoded.length + 1));
        }
    }

    return undefined;
}

export function deleteCookie(name: string): void {
    document.cookie = `${encodeURIComponent(name)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
}