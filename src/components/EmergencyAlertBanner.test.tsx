// Property-Based Tests for EmergencyAlertBanner Component
// Feature: dashboard-scoring

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { EmergencyAlertBanner } from './EmergencyAlertBanner';
import { EmergencyAlert, DoctorContact } from '../types';
import React from 'react';

// Generators
const emergencyAlertArbitrary = fc.record({
  alertId: fc.uuid(),
  userId: fc.uuid(),
  type: fc.constantFrom('weight_change', 'calorie_extreme', 'dehydration', 'sleep_deprivation'),
  severity: fc.constantFrom('warning', 'critical'),
  message: fc.string({ minLength: 20, maxLength: 150 }),
  triggeredAt: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()),
  acknowledgedAt: fc.option(fc.date().map(d => d.toISOString())),
  resolved: fc.boolean(),
}) as fc.Arbitrary<EmergencyAlert>;

const doctorContactArbitrary = fc.record({
  name: fc.string({ minLength: 5, maxLength: 50 }),
  phone: fc.string({ minLength: 10, maxLength: 15 }).map(s => s.replace(/[^0-9]/g, '')),
  email: fc.emailAddress(),
  specialty: fc.option(fc.string({ minLength: 5, maxLength: 30 })),
}) as fc.Arbitrary<DoctorContact>;

// Feature: dashboard-scoring, Property 33: Emergency banner display on threshold breach
// Validates: Requirements 9.1
describe('Property 33: Emergency banner display on threshold breach', () => {
  it('should display red emergency banner when alerts exist', () => {
    fc.assert(
      fc.property(
        fc.array(emergencyAlertArbitrary, { minLength: 1, maxLength: 5 }),
        doctorContactArbitrary,
        (alerts, doctorContact) => {
          const onAcknowledge = vi.fn();
          const onContactDoctor = vi.fn();

          const { container } = render(
            <EmergencyAlertBanner
              alerts={alerts}
              doctorContact={doctorContact}
              onAcknowledge={onAcknowledge}
              onContactDoctor={onContactDoctor}
            />
          );

          // Should display the banner
          const banner = container.querySelector('[role="alert"]');
          expect(banner).toBeInTheDocument();

          // Should have red background (emergency color)
          expect(banner?.className).toContain('bg-emergency');

          // Should display at top of dashboard (verified by presence)
          expect(banner).toBeInTheDocument();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not display banner when no alerts exist', () => {
    fc.assert(
      fc.property(
        doctorContactArbitrary,
        (doctorContact) => {
          const onAcknowledge = vi.fn();
          const onContactDoctor = vi.fn();

          const { container } = render(
            <EmergencyAlertBanner
              alerts={[]}
              doctorContact={doctorContact}
              onAcknowledge={onAcknowledge}
              onContactDoctor={onContactDoctor}
            />
          );

          // Should not display the banner
          const banner = container.querySelector('[role="alert"]');
          expect(banner).not.toBeInTheDocument();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display all alert messages', () => {
    fc.assert(
      fc.property(
        fc.array(emergencyAlertArbitrary, { minLength: 1, maxLength: 3 }),
        doctorContactArbitrary,
        (alerts, doctorContact) => {
          const onAcknowledge = vi.fn();
          const onContactDoctor = vi.fn();

          render(
            <EmergencyAlertBanner
              alerts={alerts}
              doctorContact={doctorContact}
              onAcknowledge={onAcknowledge}
              onContactDoctor={onContactDoctor}
            />
          );

          // All alert messages should be displayed
          alerts.forEach(alert => {
            expect(screen.getByText(alert.message)).toBeInTheDocument();
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should sort critical alerts before warnings', () => {
    const criticalAlert: EmergencyAlert = {
      alertId: 'critical-1',
      userId: 'user-1',
      type: 'calorie_extreme',
      severity: 'critical',
      message: 'Critical alert message',
      triggeredAt: new Date().toISOString(),
      resolved: false,
    };

    const warningAlert: EmergencyAlert = {
      alertId: 'warning-1',
      userId: 'user-1',
      type: 'dehydration',
      severity: 'warning',
      message: 'Warning alert message',
      triggeredAt: new Date().toISOString(),
      resolved: false,
    };

    const doctorContact: DoctorContact = {
      name: 'Dr. Smith',
      phone: '1234567890',
      email: 'doctor@example.com',
    };

    const { container } = render(
      <EmergencyAlertBanner
        alerts={[warningAlert, criticalAlert]} // Warning first
        doctorContact={doctorContact}
        onAcknowledge={vi.fn()}
        onContactDoctor={vi.fn()}
      />
    );

    const alertDivs = container.querySelectorAll('.bg-white.bg-opacity-10');
    
    // Critical should appear first
    expect(alertDivs[0].textContent).toContain('Critical');
    expect(alertDivs[1].textContent).toContain('Warning');
  });
});

// Feature: dashboard-scoring, Property 34: Doctor contact card with active alerts
// Validates: Requirements 9.2
describe('Property 34: Doctor contact card with active alerts', () => {
  it('should display doctor contact card when alerts are active', () => {
    fc.assert(
      fc.property(
        fc.array(emergencyAlertArbitrary, { minLength: 1, maxLength: 5 }),
        doctorContactArbitrary,
        (alerts, doctorContact) => {
          const onAcknowledge = vi.fn();
          const onContactDoctor = vi.fn();

          render(
            <EmergencyAlertBanner
              alerts={alerts}
              doctorContact={doctorContact}
              onAcknowledge={onAcknowledge}
              onContactDoctor={onContactDoctor}
            />
          );

          // Should display doctor's name
          expect(screen.getByText(doctorContact.name)).toBeInTheDocument();

          // Should display doctor's phone
          expect(screen.getByText(doctorContact.phone)).toBeInTheDocument();

          // Should display doctor's email
          expect(screen.getByText(doctorContact.email)).toBeInTheDocument();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display specialty when provided', () => {
    fc.assert(
      fc.property(
        fc.array(emergencyAlertArbitrary, { minLength: 1, maxLength: 3 }),
        doctorContactArbitrary.filter(dc => dc.specialty !== undefined),
        (alerts, doctorContact) => {
          const onAcknowledge = vi.fn();
          const onContactDoctor = vi.fn();

          render(
            <EmergencyAlertBanner
              alerts={alerts}
              doctorContact={doctorContact}
              onAcknowledge={onAcknowledge}
              onContactDoctor={onContactDoctor}
            />
          );

          if (doctorContact.specialty) {
            expect(screen.getByText(doctorContact.specialty)).toBeInTheDocument();
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

// Feature: dashboard-scoring, Property 35: Contact doctor button availability
// Validates: Requirements 9.3
describe('Property 35: Contact doctor button availability', () => {
  it('should provide "Contact Doctor Now" button with call and email functionality', () => {
    fc.assert(
      fc.property(
        fc.array(emergencyAlertArbitrary, { minLength: 1, maxLength: 3 }),
        doctorContactArbitrary,
        async (alerts, doctorContact) => {
          const onAcknowledge = vi.fn();
          const onContactDoctor = vi.fn();
          const user = userEvent.setup();

          render(
            <EmergencyAlertBanner
              alerts={alerts}
              doctorContact={doctorContact}
              onAcknowledge={onAcknowledge}
              onContactDoctor={onContactDoctor}
            />
          );

          // Should have call button
          const callButton = screen.getByLabelText('Call doctor now');
          expect(callButton).toBeInTheDocument();

          // Should have email button
          const emailButton = screen.getByLabelText('Email doctor');
          expect(emailButton).toBeInTheDocument();

          // Click call button
          await user.click(callButton);
          expect(onContactDoctor).toHaveBeenCalledWith('call');

          // Click email button
          await user.click(emailButton);
          expect(onContactDoctor).toHaveBeenCalledWith('email');

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

// Feature: dashboard-scoring, Property 36: Alert acknowledgment timestamp
// Validates: Requirements 9.4
describe('Property 36: Alert acknowledgment timestamp', () => {
  it('should call onAcknowledge with alertId when acknowledge button is clicked', () => {
    fc.assert(
      fc.property(
        emergencyAlertArbitrary.filter(a => !a.acknowledgedAt),
        doctorContactArbitrary,
        async (alert, doctorContact) => {
          const onAcknowledge = vi.fn();
          const onContactDoctor = vi.fn();
          const user = userEvent.setup();

          render(
            <EmergencyAlertBanner
              alerts={[alert]}
              doctorContact={doctorContact}
              onAcknowledge={onAcknowledge}
              onContactDoctor={onContactDoctor}
            />
          );

          // Find and click acknowledge button
          const acknowledgeButton = screen.getByRole('button', { name: new RegExp(`Acknowledge.*${alert.type}`, 'i') });
          await user.click(acknowledgeButton);

          // Should call onAcknowledge with the alert ID
          expect(onAcknowledge).toHaveBeenCalledWith(alert.alertId);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should not show acknowledge button for already acknowledged alerts', () => {
    fc.assert(
      fc.property(
        emergencyAlertArbitrary,
        doctorContactArbitrary,
        (alert, doctorContact) => {
          const acknowledgedAlert = { ...alert, acknowledgedAt: new Date().toISOString() };
          const onAcknowledge = vi.fn();
          const onContactDoctor = vi.fn();

          const { container } = render(
            <EmergencyAlertBanner
              alerts={[acknowledgedAlert]}
              doctorContact={doctorContact}
              onAcknowledge={onAcknowledge}
              onContactDoctor={onContactDoctor}
            />
          );

          // Should not have acknowledge button for this alert
          const acknowledgeButtons = container.querySelectorAll('button');
          const hasAcknowledgeButton = Array.from(acknowledgeButtons).some(
            btn => btn.textContent?.includes('Acknowledge')
          );

          expect(hasAcknowledgeButton).toBe(false);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: dashboard-scoring, Property 27: Red color exclusivity
// Validates: Requirements 7.5, 9.5
describe('Property 27: Red color exclusivity', () => {
  it('should use red color (bg-emergency) exclusively for emergency alerts', () => {
    fc.assert(
      fc.property(
        fc.array(emergencyAlertArbitrary, { minLength: 1, maxLength: 3 }),
        doctorContactArbitrary,
        (alerts, doctorContact) => {
          const onAcknowledge = vi.fn();
          const onContactDoctor = vi.fn();

          const { container } = render(
            <EmergencyAlertBanner
              alerts={alerts}
              doctorContact={doctorContact}
              onAcknowledge={onAcknowledge}
              onContactDoctor={onContactDoctor}
            />
          );

          // The banner should have bg-emergency class (red)
          const banner = container.querySelector('[role="alert"]');
          expect(banner?.className).toContain('bg-emergency');

          // The "Contact Doctor Now" button should also use emergency color
          const callButton = screen.getByLabelText('Call doctor now');
          expect(callButton.className).toContain('bg-emergency');

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
