"use client";
import React from 'react';
import { UpgradeModal } from '../../src/components/UpgradeModal';
import { PlanUpgradeCheckout } from '../../src/components/PlanUpgradeCheckout';

export default function UpgradePage() {
  return (
    <>
      <UpgradeModal />
      <PlanUpgradeCheckout plan="basic" />
      <PlanUpgradeCheckout plan="pro" />
    </>
  );
}
