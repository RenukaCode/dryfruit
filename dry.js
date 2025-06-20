 let cart = [];

        function showToast(message, type = 'success') {
            const existingToast = document.querySelector('.toast');
            if (existingToast) existingToast.remove();
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        function addToCart(category, selectId, price) {
            const select = document.getElementById(selectId);
            const value = select.value;
            const text = select.options[select.selectedIndex].text;
            if (!value) return showToast('Select an item!', 'error');
            const existing = cart.find(item => item.id === value);
            if (existing) existing.quantity++;
            else cart.push({id: value, name: text, price, quantity: 1});
            updateCartCount();
            showToast(`${text} added to cart!`);
            select.value = '';
        }

        function updateCartCount() {
            document.getElementById('cart-count').textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
        }

        document.getElementById('cart-link').onclick = e => { e.preventDefault(); showCart(); };
        document.getElementById('close-cart').onclick = () => document.getElementById('cart-modal').style.display = 'none';

        function showCart() {
            const items = cart.map((item, idx) => `
                <div class='cart-item'>
                    <div>${item.name} - ₹${item.price} x ${item.quantity}</div>
                    <button onclick='removeFromCart(${idx})'>Remove</button>
                </div>`).join('');
            document.getElementById('cart-items').innerHTML = items || '<p>Cart is empty.</p>';
            const total = cart.reduce((t, i) => t + i.price * i.quantity, 0);
            document.getElementById('cart-total').textContent = `Total: ₹${total}`;
            document.getElementById('cart-modal').style.display = 'block';
        }

        function removeFromCart(idx) {
            cart.splice(idx, 1);
            updateCartCount();
            showCart();
        }

        function proceedToCheckout() {
            if (!cart.length) return showToast('Cart empty!', 'error');
            document.getElementById('cart-modal').style.display = 'none';
            document.getElementById('contact').scrollIntoView({behavior:'smooth'});
        }

        document.getElementById('order-form').addEventListener('submit', e => {
            e.preventDefault();
            if (!cart.length) return showToast('Cart empty!', 'error');
            const orderData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                mobile: document.getElementById('mobile').value,
                address: document.getElementById('address').value,
                notes: document.getElementById('order-notes').value,
                items: cart,
                total: cart.reduce((t, i) => t + i.price * i.quantity, 0),
                orderId: 'ND' + Math.floor(Math.random() * 100000)
            };
            sendOrderEmail(orderData);
            showToast('Order placed successfully!');
            cart = [];
            updateCartCount();
            e.target.reset();
        });

        function sendOrderEmail(orderData) {
            console.log('Order Email Sent:', {
                to: orderData.email,
                subject: `Order Confirmation - ${orderData.orderId}`,
                body: `Dear ${orderData.name},\n\nThank you for your order! Here are the details:\n\nOrder ID: ${orderData.orderId}\nTotal Amount: ₹${orderData.total}\n\nItems:\n${orderData.items.map(item => `- ${item.name}: ${item.quantity} kg @ ₹${item.price}/kg = ₹${item.price * item.quantity}`).join('\n')}\n\nWe will deliver your order to:\n${orderData.address}\n\nContact Number: ${orderData.mobile}\n\nSpecial Instructions: ${orderData.notes || 'None'}\n\nThank you for shopping with Nature's Delight!`
            });
        }