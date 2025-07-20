import React from 'react';
import { motion } from 'framer-motion';
import GooglePayButton from '@google-pay/button-react';
import { updateData } from '../../service/updateFirebase';

export default function Plan({ metaData, setMetaData,setCheckDate }) {
  const handleUpdatePlan = async () => {
    const today = new Date();
    const dueDate = new Date(metaData.due);
    let baseDate = dueDate > today ? dueDate : today;
    baseDate.setDate(baseDate.getDate() + 30);
    const newDue = baseDate.toISOString();
    await updateData("", { due: newDue }, "");
    setMetaData(prev => ({ ...prev, due: newDue }));
    setCheckDate(false)
  };

  const handlePaymentSuccess = async (paymentRequest) => {
    console.log('Payment successful', paymentRequest);
    try {
      await handleUpdatePlan();
      console.log('Due date updated successfully');
    } catch (error) {
      console.error('Error updating due date:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex flex-col bg-white rounded-3xl absolute top-20 left-40 transition-all shadow-xl"
    >
      <div className="px-6 py-8 sm:p-10 sm:pb-6">
        <div className="grid items-center justify-center w-full grid-cols-1 text-left">
          <div>
            <h2 className="text-lg font-medium tracking-tighter text-gray-600 lg:text-3xl">
              Update your plan
            </h2>
            <p className="mt-2 text-sm text-gray-500">Suitable to grow steadily.</p>
          </div>
          <div className="mt-6">
            <p>
              <span className="text-5xl font-light tracking-tight text-black">$1</span>
              <span className="text-base font-medium text-gray-500"> /mo </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex px-6 pb-8 sm:px-8">
        <GooglePayButton
          environment="PRODUCTION"
          paymentRequest={{
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
              {
                type: 'CARD',
                parameters: {
                  allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                  allowedCardNetworks: ['MASTERCARD', 'VISA'],
                },
                tokenizationSpecification: {
                  type: 'PAYMENT_GATEWAY',
                  parameters: {
                    gateway: 'example',
                    gatewayMerchantId: 'exampleGatewayMerchantId',
                  },
                },
              },
            ],
            merchantInfo: {
              merchantId: 'BCR2DN7TZCX7PLKZ',
              merchantName: 'Update your Keyview plan',
            },
            transactionInfo: {
              totalPriceStatus: 'FINAL',
              totalPriceLabel: 'Total',
              totalPrice: '1.00',
              currencyCode: 'USD',
              countryCode: 'VN',
            },
          }}
          onLoadPaymentData={handlePaymentSuccess}
        />
      </div>
    </motion.div>
  );
}