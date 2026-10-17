<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\Store;
use App\Models\User;

class ProductPolicy
{
    public function viewAny(User $user, Store $store): bool
    {
        return $this->canManageStore($user, $store);
    }

    public function view(User $user, Product $product): bool
    {
        return $this->canManageStore($user, $product->store);
    }

    public function create(User $user, Store $store): bool
    {
        return $this->canManageStore($user, $store);
    }

    public function update(User $user, Product $product): bool
    {
        return $this->canManageStore($user, $product->store);
    }

    public function delete(User $user, Product $product): bool
    {
        return $this->canManageStore($user, $product->store);
    }

    private function canManageStore(User $user, Store $store): bool
    {
        return $user->hasRole('admin')
            || (
                $user->hasRole('seller')
                && $user->id === $store->user_id
            );
    }
}
