export function GetAtcoderRatingColor(rating: number): string {
    if (rating < 400) {
        return "#808080";
    } else if (rating < 800) {
        return "#804000";
    } else if (rating < 1200) {
        return "#008000";
    } else if (rating < 1600) {
        return "#00C0C0";
    } else if (rating < 2000) {
        return "#0000FF";
    } else if (rating < 2400) {
        return "#C0C000";
    } else if (rating < 2800) {
        return "#FF8000";
    } else {
        return "#FF0000";
    }
}

export function GetNowcoderRatingColor(rating: number): string {
    if (rating < 700) {
        return "#B5B5B5";
    } else if (rating < 1200) {
        return "#C172EA";
    } else if (rating < 1500) {
        return "#5C9FF8";
    } else if (rating < 2200) {
        return "#10BC9A";
    } else if (rating < 2800) {
        return "#FFCE5D";
    } else {
        return "#FF0000";
    }
}

export function GetCodeforcesRatingColor(rating: number): string {
    if (rating < 1200) {
        return "gray";
    } else if (rating < 1400) {
        return "green";
    } else if (rating < 1600) {
        return "cyan";
    } else if (rating < 1900) {
        return "blue";
    } else if (rating < 2100) {
        return "violet";
    } else if (rating < 2400) {
        return "orange";
    } else if (rating < 3000) {
        return "red";
    } else {
        return "#7b0000";
    }
}
