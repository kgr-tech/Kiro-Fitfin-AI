// EmergencyAlertBanner Component for Kiro Fitfin Agent
// Displays emergency health alerts with doctor contact information

import React from 'react';
import { EmergencyAlertProps } from '../types/components';

/**
 * EmergencyAlertBanner Component
 * Displays critical health alerts with red styling and doctor contact card
 * Red color is reserved exclusively for emergency alerts
 */
export function EmergencyAlertBanner({
  alerts,
  doctorContact,
  onAcknowledge,
  onContactDoctor,
}: EmergencyAlertProps) {
  if (alerts.length === 0) {
    return null;
  }

  // Sort alerts by severity (critical first)
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.severity === 'critical' && b.severity === 'warning') return -1;
    if (a.severity === 'warning' && b.severity === 'critical') return 1;
    return 0;
  });

  const hasCriticalAlert = sortedAlerts.some(alert => alert.severity === 'critical');

  return (
    <div
      className="bg-emergency text-white rounded-lg shadow-lg p-6 mb-6"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* Alert Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">⚠️</span>
          <h2 className="text-2xl font-bold">
            {hasCriticalAlert ? 'Critical Health Alert' : 'Health Warning'}
          </h2>
        </div>
      </div>

      {/* Alert Messages */}
      <div className="space-y-3 mb-6">
        {sortedAlerts.map((alert) => (
          <div
            key={alert.alertId}
            className="bg-white bg-opacity-10 rounded-md p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold uppercase text-sm">
                    {alert.severity === 'critical' ? '🔴 Critical' : '⚠️ Warning'}
                  </span>
                  <span className="text-sm opacity-75">
                    {new Date(alert.triggeredAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-base">{alert.message}</p>
              </div>
              {!alert.acknowledgedAt && (
                <button
                  onClick={() => onAcknowledge(alert.alertId)}
                  className="ml-4 px-3 py-1 bg-white text-emergency rounded hover:bg-gray-100 transition-colors text-sm font-medium"
                  aria-label={`Acknowledge ${alert.type} alert`}
                >
                  Acknowledge
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Contact Card */}
      <div className="bg-white text-gray-900 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span aria-hidden="true">👨‍⚕️</span>
          <span>Your Doctor</span>
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Name:</span>
            <span>{doctorContact.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Phone:</span>
            <a
              href={`tel:${doctorContact.phone}`}
              className="text-blue-600 hover:underline"
              aria-label={`Call doctor at ${doctorContact.phone}`}
            >
              {doctorContact.phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Email:</span>
            <a
              href={`mailto:${doctorContact.email}`}
              className="text-blue-600 hover:underline"
              aria-label={`Email doctor at ${doctorContact.email}`}
            >
              {doctorContact.email}
            </a>
          </div>
          {doctorContact.specialty && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Specialty:</span>
              <span>{doctorContact.specialty}</span>
            </div>
          )}
        </div>

        {/* Contact Doctor Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onContactDoctor('call')}
            className="flex-1 bg-emergency text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            aria-label="Call doctor now"
          >
            <span aria-hidden="true">📞</span>
            <span>Call Doctor Now</span>
          </button>
          <button
            onClick={() => onContactDoctor('email')}
            className="flex-1 bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            aria-label="Email doctor"
          >
            <span aria-hidden="true">✉️</span>
            <span>Email Doctor</span>
          </button>
        </div>
      </div>

      {/* Important Notice */}
      <div className="mt-4 text-sm opacity-90 text-center">
        <p>
          If you feel unwell or have concerning symptoms, please consult your doctor immediately.
          This is an automated alert and should not replace professional medical advice.
        </p>
      </div>
    </div>
  );
}
