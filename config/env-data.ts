import dotenv from 'dotenv';
import path from 'path';

// Загружаем локальные переменные окружения.
// В CI переменные будут передаваться через GitHub Secrets.
if (process.env.CI !== 'true') {
    dotenv.config({
        path: path.resolve(__dirname, '../env/dev.env'),
    });
}

// Проверяем наличие обязательной переменной.
function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Отсутствует обязательная переменная окружения: ${name}`);
    }

    return value;
}

// Экспортируем настройки приложения и тестовые данные.
export const SMALL_LOAN_URL = getRequiredEnv('URL');
export const USERNAME = getRequiredEnv('TEST_USERNAME');
export const PASSWORD = getRequiredEnv('TEST_PASSWORD');
export const SMART_ID_CODE = getRequiredEnv('TEST_SMART_ID_CODE');
export const SMART_ID_BLACKLISTED_CODE = getRequiredEnv(
    'TEST_SMART_ID_BLACKLISTED_CODE',
);