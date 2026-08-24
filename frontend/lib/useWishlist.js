'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from './api';
import { useAuth } from '../context/AuthContext';

export function useWishlist() {
  const { user } = useAuth();
  const [ids, setIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setIds([]);
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/users/wishlist');
      setProducts(data.wishlist);
      setIds(data.wishlist.map((p) => p._id));
    } catch {
      // silent — wishlist is a non-critical enhancement
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = async (productId) => {
    if (!user) {
      toast.error('Please log in to save items to your Archive.');
      return;
    }
    try {
      const { data } = await api.post(`/users/wishlist/${productId}`);
      setIds(data.wishlist.map((id) => id.toString()));
      toast.success(data.added ? 'Saved to your Archive' : 'Removed from your Archive');
      if (!data.added) setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update Archive.');
    }
  };

  const isSaved = (productId) => ids.includes(productId);

  return { ids, products, loading, toggle, isSaved, refresh };
}
