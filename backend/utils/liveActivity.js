const Product = require('../models/Product');

/**
 * LIVE ACTIVITY FEED — the store's signature feature.
 *
 * Two kinds of events go out over the same channel:
 *  1. REAL events: emitted from controllers when an actual action happens
 *     (e.g. orderController emits 'activity:purchase' after a mock order).
 *  2. SIMULATED "viewing now" events: since this is a demo store with low
 *     real traffic, we periodically emit a plausible viewer count per
 *     product so the feature is visible during a demo/portfolio review.
 *     This is clearly documented here and should be swapped for real
 *     concurrent-session tracking in a production build.
 */
const initLiveActivity = (io) => {
  io.on('connection', (socket) => {
    socket.on('activity:join_product', (productId) => {
      socket.join(`product:${productId}`);
    });
    socket.on('activity:leave_product', (productId) => {
      socket.leave(`product:${productId}`);
    });
  });

  // Simulated "N people viewing" ticker for featured/random products.
  setInterval(async () => {
    try {
      const [product] = await Product.aggregate([
        { $match: { isActive: true } },
        { $sample: { size: 1 } },
      ]);
      if (!product) return;

      const viewers = Math.floor(Math.random() * 18) + 2; // 2-19 simulated viewers
      io.to(`product:${product._id}`).emit('activity:viewers', {
        productId: product._id,
        viewers,
      });

      // Occasionally broadcast a simulated "someone just bought" ticker item
      // (separate from the REAL purchase events emitted on actual checkout)
      if (Math.random() < 0.35) {
        const demoCities = ['Lahore', 'Karachi', 'Dubai', 'London', 'Toronto', 'Berlin', 'New York'];
        io.emit('activity:purchase', {
          productName: product.name,
          city: demoCities[Math.floor(Math.random() * demoCities.length)],
          country: '',
          timestamp: new Date().toISOString(),
          simulated: true,
        });
      }
    } catch (err) {
      // fail silently — this is a cosmetic feature
    }
  }, 8000);
};

module.exports = initLiveActivity;
