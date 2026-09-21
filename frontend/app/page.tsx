import { getApiHealth } from "@/lib/api/client";

export default async function Home() {
    const data = await getApiHealth();

    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold">SellSpace</h1>

                <p className="mt-4">
                    API Status: {data.status}
                </p>

                <p>
                    Service: {data.service}
                </p>
            </div>
        </main>
    );
}