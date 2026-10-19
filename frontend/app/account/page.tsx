import type { Metadata } from 'next';

import CustomerAccount from '@/components/account/CustomerAccount';

export const metadata: Metadata = {
    title: 'My Account | SellSpace',
    description:
        'View your SellSpace account information and navigate your shopping experience.',
};

export default function AccountPage() {
    return <CustomerAccount />;
}