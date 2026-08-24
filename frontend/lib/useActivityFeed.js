'use client';

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

let sharedSocket = null;

const getSocket = () => {
  if (!sharedSocket) {
    sharedSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });
  }
  return sharedSocket;
};

/**
 * Global "recent purchases" ticker feed — used site-wide (navbar/landing).
 */
export function useActivityFeed(maxItems = 8) {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    const handler = (payload) => {
      setFeed((prev) => [payload, ...prev].slice(0, maxItems));
    };
    socket.on('activity:purchase', handler);
    return () => socket.off('activity:purchase', handler);
  }, [maxItems]);

  return feed;
}

/**
 * Per-product "N people viewing this right now" indicator.
 */
export function useProductViewers(productId) {
  const [viewers, setViewers] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!productId) return;
    const socket = getSocket();
    socketRef.current = socket;
    socket.emit('activity:join_product', productId);

    const handler = (payload) => {
      if (payload.productId === productId) setViewers(payload.viewers);
    };
    socket.on('activity:viewers', handler);

    return () => {
      socket.off('activity:viewers', handler);
      socket.emit('activity:leave_product', productId);
    };
  }, [productId]);

  return viewers;
}
