const { releaseExpiredHolds } = require("./bookingService");

// Every minute, free seats from unpaid bookings older than HOLD_MINUTES.
function startReleaseHoldsJob() {
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const n = await releaseExpiredHolds();
      if (n) console.log(`[gala] Released ${n} unpaid booking(s)`);
    } catch (err) {
      console.error("[gala] Release holds job failed:", err.message);
    } finally {
      running = false;
    }
  };
  const timer = setInterval(tick, 60 * 1000);
  timer.unref();
  tick();
  return timer;
}

module.exports = { startReleaseHoldsJob };
