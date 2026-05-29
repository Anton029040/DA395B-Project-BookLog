// logic for the filtering books based by rating(as stars) selected by user
export const starsToRating = (stars: number) => {
    return stars / 5;
};