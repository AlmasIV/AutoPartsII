"use client";

import { useState, useContext, Fragment } from "react";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import { Modal, ErrorBox, NumberController, Button } from "@/app/components/Index.js";
import redirectIfCan from "@/global-utils/redirect-helpers/redirectIfCan.js";
import { OrdersStateContext } from "@/app/components/Orders/OrdersStateContext.js";
import { KZTFormatter, roundNumberToTwoDecimalPoints } from "@/global-utils/number-formatters/index.js";
import notify from "@/global-utils/notifications/notify.js";

/*
	This is a headache. Now, I get it. I understand why tests matter. Thank God that the only person that works with this mess is just me. I hope it will be me forever, because I wish no struggle to others.
*/

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
	const [error, setError] = useState(null);

	const [soldAmount, setSoldAmount] = useState(soldPartDetails.soldAmount - 1);
	const [refundAmount, setRefundAmount] = useState(1);
	const [retainedDiscount, setRetainedDiscount] = useState(() => roundNumberToTwoDecimalPoints((soldPartDetails.discount / soldPartDetails.soldAmount) * refundAmount));

	// You cannot refund more money, if you applied a 100% discount for example.
	const [refundMoney, setRefundMoney] = useState(soldPartDetails.price > 0 ? soldPartDetails.soldPart.priceInKzt : 0);

	function calculateRefundingPrice(refundAmountVal) {
		let refundMoneyValue = roundNumberToTwoDecimalPoints(refundAmountVal * soldPartDetails.soldPart.priceInKzt);
		let discount = roundNumberToTwoDecimalPoints(((soldPartDetails.discount / soldPartDetails.soldAmount) * refundAmountVal));
		setRefundMoney(refundMoneyValue);
		setRetainedDiscount(discount);
	}

	function updateDiscount(newDiscountVal) {
		if(soldPartDetails.price < refundMoney - newDiscountVal || soldPartDetails.price === 0) {
			return;
		}
		if(newDiscountVal > soldPartDetails.discount || refundAmount === soldPartDetails.soldAmount) {
			newDiscountVal = soldPartDetails.discount;
		}
		if(newDiscountVal < 0) {
			newDiscountVal = 0;
		}
		setRetainedDiscount(roundNumberToTwoDecimalPoints(newDiscountVal));
	}

	async function onConfirmation() {
		try {
			setIsSending(true);
			setError(null);
			const computedRefundMoney = (refundMoney - retainedDiscount) < 0 ? 0 : (refundMoney - retainedDiscount);
			const response = await fetch("/api/authenticated/orders/refund", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(
					{
						orderId: orderedParts.id,
						autoPartId: soldPartDetails.soldPart.id,
						refundAmount: refundAmount,
						refundMoney: computedRefundMoney,
						retainedDiscount: retainedDiscount
					}
				)
			});
			redirectIfCan(response);
			const bodyData = await response.json();
			if(!response.ok) {
				const message = bodyData.data || `${response.status} ${response.statusText}`;
				setError(new Error(message));
				notify(globalNotification, message, "danger");
				return;
			}
			notify(globalNotification, `${refundAmount} of ${soldPartDetails.soldPart.name} was refunded.`, "success");
			soldPartDetails.discount -= retainedDiscount;
			if(soldPartDetails.soldAmount - refundAmount === 0) {
				setRefundAmount(0);
				setRetainedDiscount(0);
				setRefundMoney(0);
				setSoldAmount(0);
				if(orderedParts.totalPriceInKzt - computedRefundMoney === 0) {
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
							totalPriceInKzt: orderedParts.totalPriceInKzt - computedRefundMoney,
							soldParts: orderedParts.soldParts.filter((spd) => spd.soldPart.id !== soldPartDetails.soldPart.id)
						}
					);
					ordersState.setOrders(
						[
							...ordersState.orders.filter((o) => {
								return o.id !== orderedParts.id;
							}),
							{
								...ordersState.orders.find((o) => o.id === orderedParts.id),
								totalPriceInKzt: orderedParts.totalPriceInKzt - computedRefundMoney
							}
						].sort((o1, o2) => o2.createdOn - o1.createdOn)
					);
				}
			}
			else {
				soldPartDetails.soldAmount -= refundAmount;
				setRefundAmount(1);
				setSoldAmount(soldPartDetails.soldAmount);
				calculateRefundingPrice(1);
				setOrderedParts(
					{
						...orderedParts,
						totalPriceInKzt: orderedParts.totalPriceInKzt - computedRefundMoney,
						soldParts: orderedParts.soldParts.map((sp) => sp.soldPart.id === soldPartDetails.soldPart.id ? { ...soldPartDetails, price: soldPartDetails.price - computedRefundMoney, soldPart: { ...soldPartDetails.soldPart, amount: soldPartDetails.soldPart.amount + refundAmount } } : sp)
					}
				);
				ordersState.setOrders(
					ordersState.orders.map((o) => o.id === orderedParts.id ? { ...o, totalPriceInKzt: orderedParts.totalPriceInKzt - computedRefundMoney } : o)
				);
			}
		}
		catch(error) {
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
							<div
								className="margin-top-05rem flex-container space-between"
							>
								<h3>Refunding Amount: {refundAmount}</h3>
								<NumberController
									updater={(newRefundAmount) => {
										if(!isSending && newRefundAmount <= soldPartDetails.soldAmount && newRefundAmount > 0) {
											setSoldAmount(soldPartDetails.soldAmount - newRefundAmount);
											setRefundAmount(newRefundAmount);
											calculateRefundingPrice(newRefundAmount);
										}
									}}
									value={refundAmount}
									step={1}
								/>
							</div>
							<div
								className="margin-top-05rem flex-container space-between"
							>
								<h3>Retained Discount: {KZTFormatter.format(retainedDiscount)}</h3>
								<NumberController
									updater={updateDiscount}
									value={retainedDiscount}
									step={100}
								/>
							</div>
							<div
								className="margin-top-05rem flex-container space-between"
							>
								<h3>Refunding Money: {KZTFormatter.format(refundMoney - retainedDiscount > 0 ? refundMoney - retainedDiscount : 0)}</h3>

							</div>
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
				isDisabled={isSending || refundAmount === 0}
			/>
		</Modal>
	);
}