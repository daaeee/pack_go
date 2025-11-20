'use client';

import { useState } from 'react';
import InventoryPage from '@/components/InventoryPage';
import DeliveryPage from '@/components/DeliveryPage';
import UnpackingPage from '@/components/UnpackingPage';
import BottomMenu from '@/components/BottomMenu';
import { InventoryItem, DeliveryBatch, PageType } from "C:/Users/Пользователь/pack_go/app/types";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>('inventory');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [batches, setBatches] = useState<DeliveryBatch[]>([]);

  const renderPage = () => {
    switch (currentPage) {
      case 'inventory':
        return (
          <InventoryPage
            items={inventoryItems}
            batches={batches}
            onItemsChange={setInventoryItems}
            onBatchesChange={setBatches}
          />
        );
      case 'delivery':
        return (
          <DeliveryPage
            items={inventoryItems}
            batches={batches}
            onBatchesChange={setBatches}
          />
        );
      case 'unpacking':
        return <UnpackingPage />;
      default:
        return null;
    }
  };

  return (
    <main>
      {renderPage()}
      <BottomMenu currentPage={currentPage} onPageChange={setCurrentPage} />
    </main>
  );
}