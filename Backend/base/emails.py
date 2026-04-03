from django.conf import settings
from django.core.mail import send_mail


def _format_address(order):
    shipping_address = getattr(order, "shippingaddress", None)
    if not shipping_address:
        return "Shipping address unavailable"

    parts = [
        shipping_address.address,
        shipping_address.city,
        shipping_address.postalCode,
        shipping_address.country,
    ]
    return ", ".join(part for part in parts if part)


def _format_items(order):
    lines = []
    for item in order.orderitems.all():
        line_total = (item.qty or 0) * (item.price or 0)
        lines.append(f"- {item.name} x {item.qty} = Tk {line_total}")
    return "\n".join(lines) if lines else "- No items"


def _items_total(order):
    return sum((item.qty or 0) * (item.price or 0) for item in order.orderitems.all())


def _send_order_email(user_email, subject, message):
    if not user_email:
        return

    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", None) or getattr(
        settings, "EMAIL_HOST_USER", None
    ) or "noreply@example.com"

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=[user_email],
            fail_silently=False,
        )
    except Exception as exc:
        print(f"Order email failed for {user_email}: {exc}")


def send_order_placed_email(order):
    user_email = getattr(order.user, "email", None)
    user_name = getattr(order.user, "name", "Customer")
    address_text = _format_address(order)
    items_text = _format_items(order)

    subject = f"Order #{order.id} placed successfully"
    message = (
        f"Hi {user_name},\n\n"
        f"Your order has been placed successfully.\n\n"
        f"Order ID: {order.id}\n"
        f"Payment Method: {order.paymentMethod or 'Not selected'}\n"
        f"Items:\n{items_text}\n\n"
        f"Shipping Address:\n{address_text}\n\n"
        f"Items Price: Tk {_items_total(order)}\n"
        f"Shipping: Tk {order.shippingPrice}\n"
        f"Tax: Tk {order.taxPrice}\n"
        f"Total: Tk {order.totalPrice}\n\n"
        f"Thank you for shopping with us."
    )

    _send_order_email(user_email, subject, message)


def send_order_delivered_email(order):
    user_email = getattr(order.user, "email", None)
    user_name = getattr(order.user, "name", "Customer")
    address_text = _format_address(order)
    items_text = _format_items(order)

    subject = f"Order #{order.id} has been delivered"
    message = (
        f"Hi {user_name},\n\n"
        f"Your order has been delivered.\n\n"
        f"Order ID: {order.id}\n"
        f"Items:\n{items_text}\n\n"
        f"Delivered To:\n{address_text}\n\n"
        f"We hope you enjoy your purchase."
    )

    _send_order_email(user_email, subject, message)


def send_order_cancelled_email(order):
    user_email = getattr(order.user, "email", None)
    user_name = getattr(order.user, "name", "Customer")
    items_text = _format_items(order)

    subject = f"Order #{order.id} has been cancelled"
    message = (
        f"Hi {user_name},\n\n"
        f"Your order has been cancelled because payment was not completed in time.\n\n"
        f"Order ID: {order.id}\n"
        f"Payment Method: {order.paymentMethod or 'Not selected'}\n"
        f"Items:\n{items_text}\n\n"
        f"If you still want these items, please place a new order.\n\n"
        f"Thank you."
    )

    _send_order_email(user_email, subject, message)


def send_order_returned_email(order):
    user_email = getattr(order.user, "email", None)
    user_name = getattr(order.user, "name", "Customer")
    items_text = _format_items(order)

    subject = f"Order #{order.id} has been marked as returned"
    message = (
        f"Hi {user_name},\n\n"
        f"Your order has been marked as returned.\n\n"
        f"Order ID: {order.id}\n"
        f"Items:\n{items_text}\n\n"
        f"If you have any questions, please contact support.\n\n"
        f"Thank you."
    )

    _send_order_email(user_email, subject, message)
