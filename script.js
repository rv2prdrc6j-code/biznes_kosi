        // Telegram Bot Configuration - ВАШИ ДАННЫЕ
        const TELEGRAM_BOT_TOKEN = '7636180288:AAFV18mFCIs74CZWngBXwZy3Scswpdsdupk';
        const TELEGRAM_CHAT_ID = '@Daniilwes'; // Ваш Telegram username

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Notification system
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${type} show`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }

        // Form submission to Telegram
        document.getElementById('orderForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const loading = document.getElementById('loading');
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                product: document.getElementById('product').value,
                quantity: document.getElementById('quantity').value.trim(),
                budget: document.getElementById('budget').value.trim(),
                message: document.getElementById('message').value.trim(),
                date: new Date().toLocaleString('ru-RU'),
                source: 'Сайт Memoria'
            };

            // Basic validation
            if (!formData.name || !formData.phone || !formData.product) {
                showNotification('❌ Пожалуйста, заполните обязательные поля', 'error');
                return;
            }

            // Show loading
            submitBtn.disabled = true;
            loading.style.display = 'block';

            // Create message text for Telegram
            const telegramMessage = `
🎉 *НОВАЯ ЗАЯВКА С САЙТА* 🎉

👤 *Имя:* ${formData.name}
📞 *Телефон:* ${formData.phone}
📦 *Продукт:* ${formData.product}
📊 *Количество:* ${formData.quantity || 'Не указано'}
💰 *Бюджет:* ${formData.budget || 'Не указан'}
📝 *Детали:* ${formData.message || 'Не указаны'}
⏰ *Дата:* ${formData.date}
🌐 *Источник:* ${formData.source}

🚀 *Срочно свяжись с клиентом!*
            `.trim();

            try {
                // Send to Telegram using Bot API
                const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: telegramMessage,
                        parse_mode: 'Markdown'
                    })
                });

                const result = await response.json();

                if (result.ok) {
                    showNotification('✅ Заявка успешно отправлена! Мы свяжемся с вами в Telegram в ближайшее время.', 'success');
                    // Reset form
                    this.reset();
                } else {
                    throw new Error(result.description || 'Telegram API error');
                }

            } catch (error) {
                console.error('Error sending to Telegram:', error);
                showNotification('❌ Ошибка отправки. Пожалуйста, свяжитесь с нами напрямую через Telegram: @Daniilwes', 'error');
            } finally {
                // Hide loading
                submitBtn.disabled = false;
                loading.style.display = 'none';
            }
        });

        // Phone number formatting
        document.getElementById('phone').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format Russian phone number
            if (value.length === 0) return;
            
            let formattedValue = '+7 ';
            
            if (value.length > 1) {
                value = value.substring(1); // Remove leading 7 or 8
            }
            
            if (value.length > 0) {
                formattedValue += '(' + value.substring(0, 3);
            }
            if (value.length > 3) {
                formattedValue += ') ' + value.substring(3, 6);
            }
            if (value.length > 6) {
                formattedValue += '-' + value.substring(6, 8);
            }
            if (value.length > 8) {
                formattedValue += '-' + value.substring(8, 10);
            }
            
            e.target.value = formattedValue;
        });

        // Add some interactive effects
        document.addEventListener('DOMContentLoaded', function() {
            // Animate product cards on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe product cards
            document.querySelectorAll('.product-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        });