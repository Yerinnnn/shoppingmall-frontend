import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { Product, ProductDetail } from '../types';

interface ProductDetailTabsProps {
  product: Product;
  detail: ProductDetail;
}

const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({ product, detail }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { 
      title: '상품 설명', 
      content: () => (
        <div dangerouslySetInnerHTML={{ __html: detail?.content || '' }} />
      )
    },
    { 
      title: '상세 정보', 
      content: () => (
        <dl className="space-y-4">
          <div className="flex">
            <dt className="w-24 font-medium">제조사</dt>
            <dd>{detail?.manufacturer}</dd>
          </div>
          <div className="flex">
            <dt className="w-24 font-medium">원산지</dt>
            <dd>{detail?.origin}</dd>
          </div>
          <div className="flex">
            <dt className="w-24 font-medium">소재</dt>
            <dd>{detail?.material}</dd>
          </div>
          <div className="flex">
            <dt className="w-24 font-medium">크기</dt>
            <dd>{detail?.size}</dd>
          </div>
          <div className="flex">
            <dt className="w-24 font-medium">무게</dt>
            <dd>{detail?.weight}</dd>
          </div>
        </dl>
      )
    },
    { 
      title: '배송/반품 안내', 
      content: () => (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Truck className="w-5 h-5" />
            <span>배송 관련 안내사항...</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="mt-8">
      <div className="flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 ${
              activeTab === index
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="py-4">
        {tabs[activeTab].content()}
      </div>
    </div>
  );
};

export default ProductDetailTabs;