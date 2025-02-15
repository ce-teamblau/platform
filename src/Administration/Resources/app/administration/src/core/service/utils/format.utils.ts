// @ts-expect-error
import MD5 from 'md5-es';

/**
 * @module core/service/utils/format
 */
export default {
    currency,
    date,
    md5,
    fileSize,
    toISODate,
};

interface CurrencyOptions extends Intl.NumberFormatOptions {
    language?: string
}

/**
 * Converts a Number to a formatted currency. Especially helpful for template filters.
 * Defaults to the currencyISOCode of the standard currency and locale of the user.
 *
 * @param {Number} val - Number which should be formatted as a currency.
 * @param {String} sign - Currency sign which should be displayed
 * @param {Number} [decimalPlaces] - Number of decimal places
 * @param {Object} additionalOptions
 * @returns {string} Formatted string
 */
export function currency(val: number, sign: string, decimalPlaces: number, additionalOptions: CurrencyOptions = {}): string {
    const decimalOpts = decimalPlaces !== undefined ? {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    } : {
        minimumFractionDigits: 2,
        maximumFractionDigits: 20,
    };

    const opts = {
        style: 'currency',
        currency: sign || Shopware.Context.app.systemCurrencyISOCode as string,
        ...decimalOpts,
        ...additionalOptions,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    return val.toLocaleString((additionalOptions.language ?? Shopware.State.get('session').currentLocale) ?? 'en-US', opts);
}

/**
 * Formats a Date object to a localized string
 *
 * @param {string} val
 * @param {Object} options
 * @returns {string}
 */
export function date(val: string, options = {}): string {
    // should return an empty string when no date is given
    if (!val) {
        return '';
    }

    const givenDate = new Date(val);

    // check if given date value is valid
    // @ts-expect-error
    // eslint-disable-next-line
    if (isNaN(givenDate)) {
        return '';
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const lastKnownLang = Shopware.Application.getContainer('factory').locale.getLastKnownLocale() as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userTimeZone = Shopware?.State?.get('session')?.currentUser?.timeZone as string ?? 'UTC';

    const dateTimeFormatter = new Intl.DateTimeFormat(lastKnownLang, {
        timeZone: userTimeZone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        ...options,
    });

    return dateTimeFormatter.format(givenDate);
}

/**
 * Generates a md5 hash of the given value.
 *
 * @param {String} value
 * @return {String}
 */
export function md5(value: string): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return MD5.hash(value) as string;
}

/**
 * Formats a number of bytes to a string with a unit
 */
export function fileSize(bytes: number, locale = 'de-DE'): string {
    const denominator = 1024;
    const units = ['B', 'KB', 'MB', 'GB'];

    let result = Number.parseInt(String(bytes), 10);
    let i = 0;

    for (; i < units.length; i += 1) {
        const currentResult = result / denominator;

        if (currentResult < 0.9) {
            break;
        }

        result = currentResult;
    }

    // @ts-expect-error
    return `${result.toFixed(2).toLocaleString(locale)}${units[i]}`;
}

export function toISODate(dateObj: Date, useTime = true): string {
    const isoDate = dateObj.toISOString();

    return useTime ? isoDate : isoDate.split('T')[0];
}

