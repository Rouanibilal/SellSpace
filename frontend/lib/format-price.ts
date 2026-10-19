export function formatPrice(price: number): string {
    return `${new Intl.NumberFormat('fr-MA').format(price)} DH`;
}