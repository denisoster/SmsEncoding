const GSM_7BIT_CHARS = "@£$¥èéùìòÇ\\nØø\\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\\\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
const GSM_7BIT_EX_CHARS = "\\^{}\\\\\\[~\\]|€";

const GSM_7BIT_RE = RegExp("^[" + GSM_7BIT_CHARS + "]*$");
const GSM_7BIT_EX_RE = RegExp("^[" + GSM_7BIT_CHARS + GSM_7BIT_EX_CHARS + "]*$");
const GSM_7BIT_EX_ONLY_RE = RegExp("^[\\" + GSM_7BIT_EX_CHARS + "]*$");

const GSM_7BIT = 'GSM_7BIT';
const GSM_7BIT_EX = 'GSM_7BIT_EX';
const UCS_2 = 'UCS_2';

const MESSAGE_LENGTH = {
    GSM_7BIT: 160,
    GSM_7BIT_EX: 160,
    UCS_2: 70,
};

const MULTI_MESSAGE_LENGTH = {
    // We use 154 characters, due to the implementation of the software for sending messages. But the standard has 153 characters.
    GSM_7BIT: 154,
    GSM_7BIT_EX: 154,
    UCS_2: 67,
};

const detectEncoding = function (text) {
    if (!!text.match(GSM_7BIT_RE)) {
        return GSM_7BIT
    } else if (!!text.match(GSM_7BIT_EX_RE)) {
        return GSM_7BIT_EX
    } else {
        return UCS_2
    }
};

const lengthGSM7BitEx = function(text) {
    let gsm7BitChars = 0;
    let gsm7BitExChars = 0;

    for (const i in text) {
        const char = text.charAt(i);
        if (!!char.match(GSM_7BIT_EX_ONLY_RE)) {
            gsm7BitExChars += 1
        } else {
            gsm7BitChars += 1
        }
    }
    return gsm7BitChars + (gsm7BitExChars * 2)
};

const countParts = function (text, encoding, length) {
    let parts = 1;

    const isMultipart = length > MESSAGE_LENGTH[encoding];
    if (!isMultipart) return parts;

    const perMessageLength = MULTI_MESSAGE_LENGTH[encoding];

    return Math.ceil(length / perMessageLength);
};

const encodingParser = function (text) {
    const encoding = detectEncoding(text);
    const charsCount = encoding === GSM_7BIT_EX ? lengthGSM7BitEx(text) : text.length;
    const partsCount = countParts(text, encoding, charsCount);
    return { encoding, charsCount, partsCount };
};

export { encodingParser, GSM_7BIT, GSM_7BIT_EX, UCS_2, MESSAGE_LENGTH, MULTI_MESSAGE_LENGTH };
