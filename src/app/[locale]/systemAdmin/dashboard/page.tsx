'use client';

import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/solid';
import { useTranslations } from 'next-intl';

export default function Dashboard() {
  const t = useTranslations('dashboard'); // Sử dụng namespace "dashboard"

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Overview */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-4 shadow rounded-lg flex items-center">
          <div className="mr-4 bg-blue-100 p-3 rounded-full">
            <ArrowUpIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t('totalUsers')}</h2>
            <p className="text-2xl font-bold">40,689</p>
            <p className="text-sm text-green-500">{t('upFromYesterday', { percent: 8.5 })}</p>
          </div>
        </div>
        <div className="bg-white p-4 shadow rounded-lg flex items-center">
          <div className="mr-4 bg-green-100 p-3 rounded-full">
            <ArrowUpIcon className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t('totalClinics')}</h2>
            <p className="text-2xl font-bold">10,293</p>
            <p className="text-sm text-green-500">{t('upFromLastWeek', { percent: 1.3 })}</p>
          </div>
        </div>
        <div className="bg-white p-4 shadow rounded-lg flex items-center">
          <div className="mr-4 bg-red-100 p-3 rounded-full">
            <ArrowDownIcon className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t('totalRevenue')}</h2>
            <p className="text-2xl font-bold">$89,000</p>
            <p className="text-sm text-red-500">{t('downFromYesterday', { percent: 4.3 })}</p>
          </div>
        </div>
        <div className="bg-white p-4 shadow rounded-lg flex items-center">
          <div className="mr-4 bg-yellow-100 p-3 rounded-full">
            <ArrowUpIcon className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t('totalPending')}</h2>
            <p className="text-2xl font-bold">2,040</p>
            <p className="text-sm text-green-500">{t('upFromYesterday', { percent: 1.8 })}</p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="mt-6 bg-white p-6 shadow rounded-lg">
        <h2 className="text-lg font-semibold">{t('revenueDetails')}</h2>
        <div className="mt-4">
          <p>Here would be your chart (use a chart library like Chart.js).</p>
        </div>
      </div>

      {/* Approval History */}
      <div className="mt-6 bg-white p-6 shadow rounded-lg">
        <h2 className="text-lg font-semibold">{t('approvalHistory')}</h2>
        <table className="mt-4 w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">{t('clinicName')}</th>
              <th className="p-3">{t('location')}</th>
              <th className="p-3">{t('dateTime')}</th>
              <th className="p-3">{t('piece')}</th>
              <th className="p-3">{t('amount')}</th>
              <th className="p-3">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3">Beauty 1</td>
              <td className="p-3">6096 Marigalline Landing</td>
              <td className="p-3">12.09.2019 - 12:53 PM</td>
              <td className="p-3">423</td>
              <td className="p-3">$34,295</td>
              <td className="p-3 text-green-500">{t('accepted')}</td>
            </tr>
            <tr>
              <td className="p-3">Apple Watch</td>
              <td className="p-3">6096 Marigalline Landing</td>
              <td className="p-3">12.09.2019 - 12:53 PM</td>
              <td className="p-3">423</td>
              <td className="p-3">$34,295</td>
              <td className="p-3 text-yellow-500">{t('pending')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
