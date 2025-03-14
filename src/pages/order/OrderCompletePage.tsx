import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle,
  ChevronRight,
  Package,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import api from "../../services/apiClient";
import { Order } from "../../features/order/types";

const OrderCompletePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // location.state에서 orderId와 paymentKey를 가져옵니다
  const { orderId, paymentKey, amount } = location.state || {};

  useEffect(() => {
    // 필요한 정보가 없으면 주문 페이지로 리다이렉트
    if (!orderId) {
      navigate("/orders");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderData = await api.get<Order>(`/orders/${orderId}`);
        setOrder(orderData);
      } catch (err) {
        console.error("주문 정보를 불러오는데 실패했습니다:", err);
        setError(
          "주문 정보를 불러오는데 실패했습니다. 주문 내역에서 확인해주세요."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-3 w-full">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <Link to="/orders" className="text-indigo-600 hover:underline">
            주문 내역으로 이동
          </Link>
        </div>
      </div>
    );
  }

  // 예상 배송일 계산 (현재일 + 3일)
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      {/* 주문 완료 배너 */}
      <div className="text-center mb-10">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          주문이 완료되었습니다
        </h1>
        <p className="text-gray-600">
          주문 내역은 마이페이지에서 확인하실 수 있습니다.
        </p>
      </div>

      {/* 주문 요약 정보 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4">
          <div>
            <h3 className="text-sm text-gray-500">주문번호</h3>
            <p className="font-medium">{order?.orderNumber}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">결제 금액</h3>
            <p className="font-medium">
              {amount?.toLocaleString() || order?.totalAmount.toLocaleString()}
              원
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">결제 방법</h3>
            <p className="font-medium">{order?.paymentMethod}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">주문 일자</h3>
            <p className="font-medium">
              {order && new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <h3 className="font-medium mb-2">배송 정보</h3>
        <div className="mb-4">
          <p className="text-gray-600">{order?.deliveryAddress}</p>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Package className="w-4 h-4 mr-2" />
          <span>배송은 영업일 기준 1-3일 내에 시작됩니다.</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span>예상 배송일: {formatDate(estimatedDeliveryDate)}</span>
        </div>
      </div>

      {/* 주문 상품 요약 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="font-medium mb-4">주문 상품 요약</h3>
        <div className="space-y-4">
          {order?.items.slice(0, 2).map((item) => (
            <div
              key={item.orderItemId}
              className="flex items-center pb-4 border-b last:border-b-0 last:pb-0"
            >
              <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="ml-4 flex-grow">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity}개 × {item.price.toLocaleString()}원
                </p>
              </div>
              <div className="font-medium">
                {item.subtotal.toLocaleString()}원
              </div>
            </div>
          ))}
          {order?.items && order.items.length > 0 ? (
            <>
              {order.items.slice(0, 2).map((item) => (
                <div
                  key={item.orderItemId}
                  className="flex items-center pb-4 border-b last:border-b-0 last:pb-0"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                  <div className="ml-4 flex-grow">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity}개 × {item.price.toLocaleString()}원
                    </p>
                  </div>
                  <div className="font-medium">
                    {item.subtotal.toLocaleString()}원
                  </div>
                </div>
              ))}
              {order.items.length > 2 && (
                <div className="text-sm text-gray-500 text-center pt-2">
                  외 {order.items.length - 2}개 상품
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              주문 상품 정보가 없습니다
            </div>
          )}
        </div>
      </div>

      {/* 액션 버튼 영역 */}
      <div className="flex flex-col space-y-3">
        <Link
          to={`/orders/${order?.orderId}`}
          className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          주문 상세 보기
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
};

export default OrderCompletePage;
