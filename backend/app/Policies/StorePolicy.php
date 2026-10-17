<?php

namespace App\Policies;

use App\Models\Store;
use App\Models\User;

class StorePolicy
{
    public function create(User $user): bool
    {
        return $user->hasRole('seller')
            || $user->hasRole('admin');
    }

    public function update(User $user, Store $store): bool
    {
        return $user->hasRole('admin')
            || (
                $user->hasRole('seller')
                && $user->id === $store->user_id
            );
    }

    public function delete(User $user, Store $store): bool
    {
        return $user->hasRole('admin')
            || (
                $user->hasRole('seller')
                && $user->id === $store->user_id
            );
    }
}
