"use client";

import { useState, useContext, Fragment } from "react";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import { Modal, ErrorBox, NumberController, Button } from "@/app/components/Index.js";
import redirectIfCan from "@/utils/responseHelpers/redirectIfCan.js";
import generateGUID from "@/utils/GUID/generateGUID.js";
import { OrdersStateContext } from "@/app/components/Orders/OrdersStateContext.js";

export default function RefundOrder(
	{
		soldPartDetails,
		orderedParts,
		setOrderedParts
	}
) {
	const globalNotification = useContext(NotificationBoxContext);
	const ordersState = useContext(OrdersStateContext);
	const [isSending, setIsSending] = useState(false);
	const [soldAmount, setSoldAmount] = useState(soldPartDetails.soldAmount);
	const [refundAmount, setRefundAmount] = useState(0);
	const [error, setError] = useState(null);

	async function onConfirmation() {
		try {
			setIsSending(true);
			setError(null);
			const response = await fetch("/api/authenticated/orders/refund", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ ...soldPartDetails, refundAmount: refundAmount, orderId: orderedParts.id })
			});
			redirectIfCan(response);
			const bodyData = await response.json();
			if(!response.ok) {
				const message = bodyData.data || `${response.status} ${response.statusText}`;
				setError(new Error(message));
				globalNotification.setNotifications(
					[
						{
							message: message,
							level: "danger",
							key: generateGUID()
						},
						...globalNotification.notifications
					]
				);
				return;
			}
			setRefundAmount(0);
			globalNotification.setNotifications(
				[
					{
						message: `${soldAmount} of ${soldPartDetails.soldPart.name} was refunded.`,
						level: "success",
						key: generateGUID()
					},
					...globalNotification.notifications
				]
			);
			const discountPrice = soldPartDetails.soldPart.priceInKzt * soldPartDetails.soldPart.discountPercentage / 100;
			const refundedMoney = soldPartDetails.soldAmount * soldPartDetails.soldPart.priceInKzt - discountPrice;
			if(soldPartDetails.soldAmount - refundAmount === 0) {
				if(orderedParts.totalPriceInKzt - refundedMoney === 0){
					ordersState.setOrders(
						[
							...ordersState.orders.filter((o) => o.id !== orderedParts.id)
						]
					);
				}
				else {
					setOrderedParts(
						{
							...orderedParts,
							soldParts: orderedParts.soldParts.filter((spd) => spd.soldPart.id !== soldPartDetails.soldPart.id)
						}
					);
				}
			}
			else {
				setOrderedParts(
					{ 
						...orderedParts,
						totalPriceInKzt: orderedParts.totalPriceInKzt - refundedMoney,
						soldParts: [...orderedParts.soldParts.filter((sp) => {
							return sp.soldPart.id !== soldPartDetails.soldPart.id
						}), { ...soldPartDetails, price: soldPartDetails.price - refundedMoney, soldAmount: soldPartDetails.soldAmount - refundAmount }].sort((a, b) => a.id - b.id)
					}
				);
				ordersState.setOrders(
					[
						...ordersState.orders.filter((o) => {
							return o.id !== orderedParts.id;
						}),
						{
							...orderedParts.orders.find((o) => o.id === orderedParts.id),
							totalPriceInKzt: orderedParts.totalPriceInKzt - refundedMoney
						}
					]
				);
			}
		}
		catch(error) {
			// Log the error.
			setError(new Error("Something went wrong."));
		}
		finally {
			setIsSending(false);
		}
	}
	return (
		<Modal
			openButtonTitle="Refund"
			closeButtonTitle="Cancel"
			openButtonClass={`${isSending ? "disabled-btn" : "danger-btn"} margin-top-05rem margin-bottom-05rem`}
			closeButtonClass="secondary-btn width-full"
			dialogType="adaptive-modal"
			onOpenButtonClick={() => {}}
			isDisabled={isSending}
		>
			<div
				className="margin-top-05rem margin-bottom-05rem"
			>
				{
					error ?
						<ErrorBox
							error={error}
						/> :
						<Fragment>
							<h3>Sold Amount: {soldAmount}</h3>
							<NumberController
								onIncrement={() => {
									if(!isSending) {
										if(soldAmount >= 1) {
											setRefundAmount(refundAmount + 1);
											setSoldAmount(soldAmount - 1);
										}
									}
								}}
								onDecrement={() => {
									if(!isSending) {
										if(refundAmount >= 1) {
											setRefundAmount(refundAmount - 1);
											setSoldAmount(soldAmount + 1);
										}
									}
								}}
								value={refundAmount}
								containerStyles="margin-top-2rem"
							/>
						</Fragment>
				}
			</div>
			<Button
				title="Confirm"
				className={`${isSending || refundAmount === 0 ? "disabled-btn" : "primary-btn"} width-full margin-bottom-05rem margin-top-2rem`}
				type="button"
				onClick={async () => {
					await onConfirmation();
				}}
				isDisabled={isSending}
			/>
		</Modal>
	);
}