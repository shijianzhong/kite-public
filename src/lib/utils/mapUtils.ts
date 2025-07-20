/**
 * Utility functions for handling map URLs and device detection
 */

/**
 * Detects if the current device is an Apple device
 */
export function isAppleDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent.toLowerCase();

  // Check for iOS devices
  const isIOS =
    /iphone|ipad|ipod/.test(userAgent) ||
    // iPad on iOS 13+ with desktop mode
    (navigator.maxTouchPoints > 1 && /macintosh/.test(userAgent));

  // Check for macOS
  const isMacOS =
    /macintosh|mac os x/.test(userAgent) && navigator.maxTouchPoints === 0;

  return isIOS || isMacOS;
}

/**
 * Detects if the current device is iOS specifically
 */
export function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent.toLowerCase();

  return (
    /iphone|ipad|ipod/.test(userAgent) ||
    // iPad on iOS 13+ with desktop mode
    (navigator.maxTouchPoints > 1 && /macintosh/.test(userAgent))
  );
}

/**
 * Opens the appropriate map service based on the device and location
 */
export function openMapLocation(location: string): void {
  if (!location) return;

  const encodedLocation = encodeURIComponent(location);

  if (isAppleDevice()) {
    // For all Apple devices (iOS and macOS), use the maps:// protocol to open in the native app
    // Create a temporary link and click it to trigger the protocol
    const link = document.createElement("a");
    link.href = `maps://maps.apple.com/?q=${encodedLocation}`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Use Google Maps for other devices with the correct official URL format
    const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    window.open(googleMapUrl, "_blank");
  }
}

/**
 * Gets the appropriate map service name for the current device
 */
export function getMapServiceName(): string {
  return isAppleDevice() ? "Apple Maps" : "Google Maps";
}
