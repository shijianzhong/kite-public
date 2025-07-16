import { browser } from "$app/environment";
import type { Category } from "$lib/types";
import { experimental } from "$lib/stores/experimental.svelte";

interface TouchState {
  startX: number;
  startY: number;
  startedOnScrollable: boolean;
}

export class CategorySwipeHandler {
  private touchState: TouchState = {
    startX: 0,
    startY: 0,
    startedOnScrollable: false,
  };

  private categories: Category[] = [];
  private currentCategory: string = "";
  private onCategoryChange: ((category: string) => void) | null = null;

  constructor() {
    // Bind methods to preserve 'this' context
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  // Update the handler with current state
  public updateState(
    categories: Category[],
    currentCategory: string,
    onCategoryChange: (category: string) => void,
  ) {
    this.categories = categories;
    this.currentCategory = currentCategory;
    this.onCategoryChange = onCategoryChange;
  }

  private findScrollableParent(element: Element): Element | null {
    if (!element) return null;

    const parent = element.parentElement;
    if (!parent) return null;

    // Check if parent is scrollable horizontally
    const style = window.getComputedStyle(parent);
    const isScrollable =
      parent.scrollWidth > parent.clientWidth &&
      (style.overflowX === "auto" || style.overflowX === "scroll");

    return isScrollable ? parent : this.findScrollableParent(parent);
  }

  private isMobileDevice(): boolean {
    return browser && window.innerWidth <= 768;
  }

  private hasTextSelection(): boolean {
    const selection = window.getSelection();
    return (
      selection !== null &&
      selection.toString().length > 0 &&
      selection.type === "Range"
    );
  }

  private isTouchOnCategoryTabs(target: Element): boolean {
    const categoryTabs = document.querySelector(".category-tabs");
    return (
      categoryTabs !== null &&
      (categoryTabs.contains(target) || categoryTabs === target)
    );
  }

  private changeToCategory(direction: "next" | "previous"): void {
    if (!this.onCategoryChange || this.categories.length === 0) return;

    const currentIndex = this.categories.findIndex(
      (cat) => cat.id === this.currentCategory,
    );

    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === "next") {
      nextIndex = currentIndex + 1;
      // Don't wrap around - if at the end, do nothing
      if (nextIndex >= this.categories.length) return;
    } else {
      nextIndex = currentIndex - 1;
      // Don't wrap around - if at the beginning, do nothing
      if (nextIndex < 0) return;
    }

    const nextCategory = this.categories[nextIndex];
    this.onCategoryChange(nextCategory.id);

    // Scroll the new active category into view
    setTimeout(() => {
      const selectedTab = document.querySelector(".category-tab.active");
      if (selectedTab) {
        selectedTab.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 100);
  }

  public handleTouchStart(event: TouchEvent): void {
    if (!this.isMobileDevice()) return;
    
    // Check if swipe is disabled in experimental settings
    if (experimental.disableCategorySwipe) return;

    this.touchState.startX = event.changedTouches[0].screenX;
    this.touchState.startY = event.changedTouches[0].screenY;

    // Check if touch started on a scrollable element
    const target = event.target as Element;
    const scrollableParent = this.findScrollableParent(target);
    this.touchState.startedOnScrollable = scrollableParent !== null;
  }

  public handleTouchEnd(event: TouchEvent): void {
    if (!this.isMobileDevice()) return;
    
    // Check if swipe is disabled in experimental settings
    if (experimental.disableCategorySwipe) return;

    // Check if there's text selection
    if (this.hasTextSelection()) {
      return;
    }

    // Don't handle if touch started on a scrollable element
    if (this.touchState.startedOnScrollable) {
      return;
    }

    // Check if the touch started on or within the category tabs
    const target = event.target as Element;
    if (this.isTouchOnCategoryTabs(target)) {
      return;
    }

    const touchEndX = event.changedTouches[0].screenX;
    const touchEndY = event.changedTouches[0].screenY;
    const deltaX = this.touchState.startX - touchEndX;
    const deltaY = this.touchState.startY - touchEndY;

    // Require horizontal movement to be at least twice the vertical movement
    // This makes accidental swipes less likely
    if (Math.abs(deltaX) < Math.abs(deltaY) * 2) {
      return;
    }

    // Only proceed if swipe distance is significant enough
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swiped left, go to next category
        this.changeToCategory("next");
      } else {
        // Swiped right, go to previous category
        this.changeToCategory("previous");
      }
    }
  }
}

// Export singleton instance for easy use
export const categorySwipeHandler = new CategorySwipeHandler();
