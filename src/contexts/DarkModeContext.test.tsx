// Property-Based Tests for Dark Mode Context
// Feature: dashboard-scoring

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { DarkModeProvider, useDarkMode } from './DarkModeContext';
import React from 'react';

// Helper to clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

// Feature: dashboard-scoring, Property 24: Dark mode toggle round-trip
// Validates: Requirements 7.1, 7.2
describe('Property 24: Dark mode toggle round-trip', () => {
  it('toggling dark mode twice should return to original state', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (initialState) => {
          // Set initial state in localStorage
          localStorage.setItem('kiro-fitfin-dark-mode', String(initialState));

          const { result } = renderHook(() => useDarkMode(), {
            wrapper: ({ children }) => <DarkModeProvider>{children}</DarkModeProvider>,
          });

          // Verify initial state
          expect(result.current.isDark).toBe(initialState);

          // Toggle once
          act(() => {
            result.current.toggleDarkMode();
          });

          const afterFirstToggle = result.current.isDark;
          expect(afterFirstToggle).toBe(!initialState);

          // Toggle again
          act(() => {
            result.current.toggleDarkMode();
          });

          const afterSecondToggle = result.current.isDark;

          // Should be back to initial state
          expect(afterSecondToggle).toBe(initialState);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('multiple toggle cycles should maintain consistency', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.integer({ min: 1, max: 10 }),
        (initialState, toggleCount) => {
          // Set initial state
          localStorage.setItem('kiro-fitfin-dark-mode', String(initialState));

          const { result } = renderHook(() => useDarkMode(), {
            wrapper: ({ children }) => <DarkModeProvider>{children}</DarkModeProvider>,
          });

          // Verify initial state
          expect(result.current.isDark).toBe(initialState);

          // Toggle multiple times
          for (let i = 0; i < toggleCount; i++) {
            act(() => {
              result.current.toggleDarkMode();
            });
          }

          // After even number of toggles, should be back to initial
          // After odd number of toggles, should be opposite
          const expectedState = toggleCount % 2 === 0 ? initialState : !initialState;
          expect(result.current.isDark).toBe(expectedState);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply dark class to document root when dark mode is enabled', () => {
    const { result } = renderHook(() => useDarkMode(), {
      wrapper: ({ children }) => <DarkModeProvider>{children}</DarkModeProvider>,
    });

    // Start in light mode
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle to dark mode
    act(() => {
      result.current.toggleDarkMode();
    });

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Toggle back to light mode
    act(() => {
      result.current.toggleDarkMode();
    });

    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

// Feature: dashboard-scoring, Property 25: Theme persistence
// Validates: Requirements 7.3
describe('Property 25: Theme persistence', () => {
  it('should persist theme preference to localStorage', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (targetState) => {
          const { result } = renderHook(() => useDarkMode(), {
            wrapper: ({ children }) => <DarkModeProvider>{children}</DarkModeProvider>,
          });

          // Set to target state
          if (result.current.isDark !== targetState) {
            act(() => {
              result.current.toggleDarkMode();
            });
          }

          // Verify localStorage was updated
          const stored = localStorage.getItem('kiro-fitfin-dark-mode');
          expect(stored).toBe(String(targetState));

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should restore theme preference from localStorage on mount', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (storedState) => {
          // Set preference in localStorage before mounting
          localStorage.setItem('kiro-fitfin-dark-mode', String(storedState));

          // Mount the hook
          const { result } = renderHook(() => useDarkMode(), {
            wrapper: ({ children }) => <DarkModeProvider>{children}</DarkModeProvider>,
          });

          // Should restore the stored preference
          expect(result.current.isDark).toBe(storedState);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain preference across multiple mount/unmount cycles', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.integer({ min: 1, max: 5 }),
        (initialState, cycles) => {
          // Set initial preference
          localStorage.setItem('kiro-fitfin-dark-mode', String(initialState));

          let lastState = initialState;

          for (let i = 0; i < cycles; i++) {
            // Mount
            const { result, unmount } = renderHook(() => useDarkMode(), {
              wrapper: ({ children }) => <DarkModeProvider>{children}</DarkModeProvider>,
            });

            // Verify state was restored
            expect(result.current.isDark).toBe(lastState);

            // Toggle
            act(() => {
              result.current.toggleDarkMode();
            });

            lastState = result.current.isDark;

            // Unmount
            unmount();
          }

          // Final mount to verify persistence
          const { result } = renderHook(() => useDarkMode(), {
            wrapper: ({ children }) => <DarkModeProvider>{children}</DarkModeProvider>,
          });

          expect(result.current.isDark).toBe(lastState);

          return true;
        }
      ),
      { numRuns: 50 } // Fewer runs since this involves multiple mount/unmount cycles
    );
  });
});
