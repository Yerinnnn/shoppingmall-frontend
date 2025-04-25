import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { ReviewList } from "../../review";
import { useAuth } from "../../auth/hooks/useAuth";

// 탭 타입 정의
type TabType = "description" | "specs" | "reviews" | "shipping";

const ProductDetailWithReviews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0");
  const { product, loading, error } = useProduct(id);
  const { isAuthenticated } = useAuth();

  // 활성 탭 상태
  const [activeTab, setActiveTab] = useState<TabType>("description");

  // 탭 전환 핸들러
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="bg-gray-200 rounded-lg aspect-square"></div>
          </div>
          <div className="md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-12 bg-gray-200 rounded w-1/3 mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-red-500">
        상품 정보를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  // 주문 아이템 ID (실제로는 로그인한 사용자의 주문 내역에서 가져와야 함)
  // 이 부분은 실제 구현 시 backend에서 현재 사용자가 이 상품을 구매했는지 확인하는 API가 필요함
  const hasOrdered = false; // 테스트용으로 false로 설정
  const orderItemId = undefined; // null 대신 undefined 사용

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* 상품 기본 정보 */}
      <div className="flex flex-col md:flex-row gap-8 p-6">
        {/* 상품 이미지 */}
        <div className="md:w-1/2">
          <img
            src="/placeholder-product.jpg"
            alt={product.name}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>

        {/* 상품 정보 */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">
              {product.price?.toLocaleString()}원
            </span>
            {/* originalPrice 속성이 없으므로 이 부분 제거 */}
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="border-t border-gray-200 my-4 pt-4">
            <div className="grid grid-cols-2 gap-y-2">
              <span className="text-gray-500">카테고리</span>
              <span>{product.categoryName}</span>

              <span className="text-gray-500">재고</span>
              <span>{product.stockQuantity}개</span>
            </div>
          </div>

          {/* 장바구니 및 구매 버튼 */}
          <div className="flex space-x-2 mt-6">
            <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition">
              장바구니에 담기
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition">
              바로 구매하기
            </button>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-t border-gray-200">
        <div className="flex border-b">
          <button
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === "description"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("description")}
          >
            상세 설명
          </button>
          <button
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === "specs"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("specs")}
          >
            상품 정보
          </button>
          <button
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === "reviews"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("reviews")}
          >
            리뷰
          </button>
          <button
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === "shipping"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("shipping")}
          >
            배송/환불
          </button>
        </div>

        {/* 탭 내용 */}
        <div className="p-6">
          {/* 상세 설명 탭 */}
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: product.description || "" }}
              />
              {/* 상세 이미지 관련 코드 제거 (Product 타입에 detailImages 속성이 없음) */}
            </div>
          )}

          {/* 상품 정보 탭 */}
          {activeTab === "specs" && (
            <div className="overflow-hidden bg-white">
              <div className="border-b border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      제조사
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      정보 없음
                    </dd>
                  </div>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      원산지
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      정보 없음
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">소재</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      정보 없음
                    </dd>
                  </div>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">크기</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      정보 없음
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">무게</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      정보 없음
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* 리뷰 탭 */}
          {activeTab === "reviews" && (
            <div>
              <ReviewList
                productId={productId}
                showReviewForm={hasOrdered && isAuthenticated}
                orderItemId={orderItemId}
              />
            </div>
          )}

          {/* 배송/환불 탭 */}
          {activeTab === "shipping" && (
            <div className="prose max-w-none">
              <h3>배송 정보</h3>
              <ul>
                <li>배송 방법: 택배</li>
                <li>배송 지역: 전국</li>
                <li>배송 비용: 3,000원 (30,000원 이상 구매 시 무료)</li>
                <li>배송 기간: 2~3일 (주말, 공휴일 제외)</li>
              </ul>

              <h3>교환 및 반품 안내</h3>
              <ul>
                <li>교환/반품 신청 기간: 상품 수령 후 7일 이내</li>
                <li>
                  교환/반품 비용: 단순 변심에 의한 교환/반품 시 왕복 배송비
                  6,000원 고객 부담
                </li>
                <li>
                  교환/반품 불가 사유: 고객의 책임 있는 사유로 상품 등이 멸실
                  또는 훼손된 경우
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailWithReviews;
