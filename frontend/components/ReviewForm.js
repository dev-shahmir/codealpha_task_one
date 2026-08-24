'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';

export default function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      toast.success('Thank you! Your review has been published.');
      setComment('');
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-hairline p-6 my-6 shadow-sm">
      <h4 className="font-display text-lg text-ink font-semibold mb-4">Write a Product Review</h4>

      <div className="mb-4">
        <label className="eyebrow text-ash block mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl transition-transform ${
                star <= rating ? 'text-amber-400 scale-110' : 'text-cloud'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="eyebrow text-ash block mb-2">Your Review</label>
        <textarea
          rows={3}
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share details regarding fit, material weight, and tailoring..."
          className="input-field"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary py-3 px-6 text-xs">
        {loading ? 'Submitting...' : 'Post Review'}
      </button>
    </form>
  );
}
