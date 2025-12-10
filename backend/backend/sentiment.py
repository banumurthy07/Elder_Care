POSITIVE_WORDS = ["happy", "good", "fine", "better", "great", "okay"]
NEGATIVE_WORDS = ["sad", "lonely", "tired", "worried", "anxious", "depressed", "bad", "pain"]


def simple_sentiment(text: str):
    text_l = text.lower()
    score = 0
    for w in POSITIVE_WORDS:
        if w in text_l:
            score += 1
    for w in NEGATIVE_WORDS:
        if w in text_l:
            score -= 1

    if score > 0:
        return "positive", 1
    elif score < 0:
        return "negative", -1
    else:
        return"neutral", 0