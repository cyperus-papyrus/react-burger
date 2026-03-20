export function formatOrderDate(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let dayPart: string;
    if (diffDays === 0) {
        dayPart = 'Сегодня';
    } else if (diffDays === 1) {
        dayPart = 'Вчера';
    } else {
        dayPart = `${diffDays} дня(-ей) назад`;
    }

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${dayPart}, ${hours}:${minutes}`;
}