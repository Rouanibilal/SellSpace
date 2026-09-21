const API_URL = process.env.LARAVEL_API_URL;

if (!API_URL) {
    throw new Error("LARAVEL_API_URL is not configured");
}

export async function getApiHealth() {
    const response = await fetch(`${API_URL}/api/health`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Laravel API returned ${response.status}`);
    }

    return response.json() as Promise<{
        status: string;
        service: string;
    }>;
}
