/**
 * Convert minutes into `hh:mm:ss` format.
 * @param {number} minutes - Total minutes to format.
 * @returns {string} - Formatted time string (e.g., "1:15:30" or "16:00:45").
 */
export function formatMinutes(minutes: number): string {
    // Convert fractional minutes to total seconds
    const totalSeconds = Math.round(minutes * 60); 
    // Calculate hours, remaining minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    // Return formatted time string (hh:mm:ss)
    return `${hours}:${remainingMinutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
