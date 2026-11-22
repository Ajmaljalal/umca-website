// "2026-03-07" -> "March 7, 2026" (parsed as a calendar date, not shifted by time zone)
export const formatDate = (value) => {
    if (!value) return '';
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
    const date = match
        ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
        : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};
